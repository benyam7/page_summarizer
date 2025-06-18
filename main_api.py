# main_api.py (your new Python API file)
import dotenv
import asyncio
import os
# os.environ['PYPPETEER_CHROMIUM_REVISION'] = '1263111' # Keep this if it works for your deployment

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware # For allowing Next.js to call
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from rich.console import Console
from rich.markdown import Markdown # You might not use Rich directly in API responses
from openai import OpenAI, AsyncOpenAI
from openai.types.chat import ChatCompletion
from typing import Optional, Union, Dict, List, Literal
from pyppeteer import launch
from pyppeteer_stealth import stealth
from random import randint
import google.generativeai as genai # For Google Gemini
import json

console = Console() # For server-side logging

# --- Your Config, Website, LlmSummarizer classes go here ---
# Minor modifications needed for Website class

class Config:
    def __init__(self, filename: str = ".env"):
        dotenv.load_dotenv(filename)
        self._config = dotenv.dotenv_values(filename)
        # Ensure OPENAI_API_KEY is loaded, or raise an error early
        if not self.get("OPENAI_API_KEY"):
            print("No API key was found - please head over to the troubleshooting notebook in this folder to identify & fix!")
            # raise ValueError("OPENAI_API_KEY not found in .env file")

    def get(self, key: str) -> str:
        return self._config.get(key, None)

    @property
    def openai_api_key(self) -> str:
        return self.get("OPENAI_API_KEY")

class Website:
    __url: str
    __title: str
    __text: str

    # ... (properties remain the same) ...
    @property
    def url(self) -> str:
        return self.__url

    @property
    def title(self) -> str:
        return self.__title

    @property
    def text(self) -> str:
        return self.__text

    # CRITICAL CHANGE: __scrape must be an async method that can be awaited
    # It should not call asyncio.run() itself.
    async def scrape_async(self) -> None:
        console.print("Started scraping")
        browser = None
        page = None
        try:
            browser = await launch(
                        headless=True,
                        handleSIGINT=False,
                        handleSIGTERM=False,
                        handleSIGHUP=False,
                        args=[
                            '--no-sandbox',
                            '--disable-setuid-sandbox',
                            '--disable-dev-shm-usage', # Often needed in limited resource environments
                            '--disable-gpu',           # Usually not needed for headless
                            # Add other essential args only if proven necessary
                        ],
                        # ignoreHTTPSErrors=True, # Be cautious with this in production
                        executablePath='/usr/bin/chromium' # This is good
                    )
            page = await browser.newPage()
            await stealth(page)

            # Set timeouts using correct property names
            page.defaultNavigationTimeout = 60000  # 60 seconds
            page.defaultTimeout = 60000  # 60 seconds for other operations

            user_agents: List[str] = [
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15",
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
            ]
            ua = user_agents[randint(0, len(user_agents) - 1)]
            await page.setUserAgent(ua)

            # Set viewport to a reasonable desktop size
            await page.setViewport({'width': 1280, 'height': 800})

            await page.setRequestInterception(False)
            
            try:
                # First attempt with networkidle0
                await page.goto(
                    self.__url,
                    {
                        "waitUntil": "networkidle0",
                        "timeout": 60000  # 60 seconds timeout
                    }
                )
            except Exception as nav_error:
                console.print(f"[yellow]First navigation attempt failed, retrying with different settings: {nav_error}[/yellow]")
                # If first attempt fails, try again with different settings
                await page.goto(
                    self.__url,
                    {
                        "waitUntil": "domcontentloaded",
                        "timeout": 60000
                    }
                )

            # Wait for body with increased timeout
            await page.waitForSelector('body', {"timeout": 30000})
            
            # Wait a bit for dynamic content
            await asyncio.sleep(2)
            
            self.__title = await page.title()
            self.__text = await page.evaluate('() => document.body.innerText')

        except Exception as e:
            console.print(f"[red]Error scraping {self.__url}: {e}[/red]")
            self.__title = "Error"
            self.__text = f"Could not scrape content: {str(e)}"
            raise
        finally:
            if page:
                console.print("Closing page")
                await page.close()
            if browser:
                console.print("Closing browser")
                await browser.close()

    # The constructor now needs to be async or call an async method
    # We'll make an async factory method instead for clarity
    @classmethod
    async def create(cls, url: str):
        instance = cls()
        instance.__url = url
        await instance.scrape_async() # Scrape when created
        return instance

    # Private constructor for the factory method
    def __init__(self):
        pass

    def __str__(self) -> str:
        return f"Website(url={self.url}, title=\"{self.title}\")"

LLMProvider = Literal["openai", "ollama", "anthropic", "google", "groq", "deepseek"]  

class LlmSummarizer:
    def __init__(self, global_config: Config):
        self.global_config = global_config
        # For Google, API key is configured globally via the SDK usually
        # but we'll accept it from the user for max flexibility

    def _get_system_prompt(self) -> Dict[str, str]:
        return {
            "role": "system",
            "content": (
                "You are an assistant that analyzes the contents of a website "
                "and provides a short summary, ignoring the text that might be navigation-related. "
                "Respond in markdown and be concise."
            )
        }

    def _get_user_prompt(self, website: Website) -> Dict[str, str]:
        return {
            "role": "user",
            "content": (
                f"You are looking at the website titled \"{website.title}\". "
                "The content of this website is as follows; "
                "please provide a short summary of this website in markdown. "
                "If it includes news or announcements, then summarize these too.\n\n"
                f"\"\"\"\n{website.text}\n\"\"\"\n\n"
            )
        }
        
    async def summarize(
        self,
        website_url: str,
        llm_provider: LLMProvider,
        api_key: Optional[str] = None,
        model_name: Optional[str] = None,
        base_url: Optional[str] = None
    ) -> Optional[str]:
        print("Started summarization i.e hitting the LLM")
        try:
            website = await Website.create(website_url)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to scrape website: {str(e)}")

        if "Could not scrape content" in website.text:
             raise HTTPException(status_code=500, detail=f"Failed to process website content from: {website.url}")

        system_prompt_dict = self._get_system_prompt()
        user_prompt_dict = self._get_user_prompt(website)

        # For Google Gemini, the prompt structure is a bit different (no explicit 'system' role in simpler use)
        # We can concatenate or adapt. For now, let's try a simple concatenation for Gemini.
        # Or, Gemini supports specific "tools" and "system_instruction" in more advanced setups.
        
        # For Groq using OpenAI SDK, messages format is standard.

        try:
            if llm_provider == "openai":
                if not api_key:
                    raise HTTPException(status_code=400, detail="API key is required for OpenAI.")
                effective_model = model_name or "gpt-4o-mini"
                client = AsyncOpenAI(api_key=api_key, base_url=base_url)
                messages_for_openai = [system_prompt_dict, user_prompt_dict]
                response = await client.chat.completions.create(
                    model=effective_model,
                    messages=messages_for_openai,
                    temperature=0.2,
                    max_tokens=1024,
                )
                return response.choices[0].message.content

            elif llm_provider == "ollama":
                effective_model = model_name or "gemma2:9b"
                ollama_url = base_url or self.global_config.ollama_base_url
                client = AsyncOpenAI(base_url=ollama_url, api_key=api_key or "ollama")
                messages_for_ollama = [system_prompt_dict, user_prompt_dict]
                response = await client.chat.completions.create(
                    model=effective_model,
                    messages=messages_for_ollama,
                    temperature=0.2,
                    max_tokens=1024,
                )
                return response.choices[0].message.content
            elif llm_provider == "deepseek":
                if not api_key:
                    raise HTTPException(status_code=400, detail="API key is required for DeepSeek.")
                effective_model = model_name or "deepseek-chat"
                client = AsyncOpenAI(api_key=api_key, base_url='https://api.deepseek.com')
                messages_for_deepseek = [system_prompt_dict, user_prompt_dict]
                response = await client.chat.completions.create(
                    model=effective_model,
                    messages=messages_for_deepseek,
                    temperature=0.2,
                    max_tokens=1024,
                    stream=False
                )
                return response.choices[0].message.content
            elif llm_provider == "anthropic":
                if not api_key:
                    raise HTTPException(status_code=400, detail="API key is required for Anthropic.")
                effective_model = model_name or "claude-3-haiku-20240307"
                client = AsyncAnthropic(api_key=api_key, base_url=base_url)
                response = await client.messages.create(
                    model=effective_model,
                    system=system_prompt_dict['content'],
                    messages=[user_prompt_dict],
                    max_tokens=1024,
                    temperature=0.2,
                )
                return response.content[0].text
            
            elif llm_provider == "google":
                if not api_key:
                    raise HTTPException(status_code=400, detail="API key is required for Google Generative AI.")
                
                # Configure the SDK with the API key
                try:
                    genai.configure(api_key=api_key)
                except Exception as e:
                    raise HTTPException(status_code=500, detail=f"Failed to configure Google AI SDK: {str(e)}")

                effective_model = model_name or "gemini-1.5-flash-latest" # Or "gemini-pro"
                
                # Gemini models have different ways to handle system instructions.
                # Option 1: Using `system_instruction` (for newer models that support it well)
                # model_instance = genai.GenerativeModel(
                #     model_name=effective_model,
                #     system_instruction=system_prompt_dict['content']
                # )
                # full_prompt = user_prompt_dict['content']

                # Option 2: Prepending system context to the user prompt (more broadly compatible)
                model_instance = genai.GenerativeModel(model_name=effective_model)
                full_prompt = f"{system_prompt_dict['content']}\n\n{user_prompt_dict['content']}"

                # Non-streaming generation
                # Note: The google-generativeai SDK's generate_content is synchronous.
                # To make it async, you'd typically run it in a thread pool executor with FastAPI.
                loop = asyncio.get_event_loop()
                try:
                    # For safety config, see Google AI Studio docs. Example:
                    safety_settings = [
                        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
                    ]
                    generation_config = genai.types.GenerationConfig(
                        # candidate_count=1, # Default is 1
                        # stop_sequences=['...'],
                        max_output_tokens=1024,
                        temperature=0.2,
                        # top_p=...,
                        # top_k=...
                    )
                    # The SDK call itself is sync
                    response = await loop.run_in_executor(
                        None, # Uses default ThreadPoolExecutor
                        lambda: model_instance.generate_content(
                            full_prompt,
                            generation_config=generation_config,
                            safety_settings=safety_settings
                        )
                    )
                    # Check for empty response or blocked content
                    if not response.candidates or not response.text:
                         # Log the finish_reason and safety_ratings for debugging
                        console.print(f"[yellow]Google AI response empty or blocked. Finish reason: {response.prompt_feedback if response.prompt_feedback else 'N/A'}. Safety ratings: {response.candidates[0].safety_ratings if response.candidates else 'N/A'}[/yellow]")
                        # Try to get more info if available
                        block_reason = "Unknown reason"
                        if response.prompt_feedback and response.prompt_feedback.block_reason:
                            block_reason = response.prompt_feedback.block_reason_message or str(response.prompt_feedback.block_reason)
                        raise HTTPException(status_code=400, detail=f"Content generation blocked by Google AI. Reason: {block_reason}")
                    return response.text
                except Exception as e:
                    # Catch specific Google API errors if possible, or re-raise generic
                    console.print(f"[red]Error with Google AI generation: {e}[/red]")
                    if "API key not valid" in str(e):
                         raise HTTPException(status_code=401, detail="Invalid Google API Key.")
                    raise HTTPException(status_code=500, detail=f"Error during Google AI summarization: {str(e)}")

            elif llm_provider == "groq":
                if not api_key:
                    raise HTTPException(status_code=400, detail="API key is required for Groq.")
                
                # Option 1: Using Groq's own SDK (AsyncGroqClient)
                # effective_model = model_name or "llama3-8b-8192" # Check Groq docs for available models
                # client = AsyncGroqClient(api_key=api_key, base_url=base_url) # base_url usually not needed for Groq Cloud
                # messages_for_groq = [system_prompt_dict, user_prompt_dict]
                # response = await client.chat.completions.create(
                #     model=effective_model,
                #     messages=messages_for_groq,
                #     temperature=0.2,
                #     max_output_tokens=1024, # Groq uses max_output_tokens
                # )
                # return response.choices[0].message.content

                # Option 2: Using OpenAI SDK with Groq's endpoint (Often simpler if already using OpenAI SDK)
                effective_model = model_name or "llama3-8b-8192" # Groq's default or common model
                # Groq's OpenAI-compatible endpoint:
                groq_openai_base_url = base_url or "https://api.groq.com/openai/v1"
                
                client = AsyncOpenAI(api_key=api_key, base_url=groq_openai_base_url)
                messages_for_groq_openai = [system_prompt_dict, user_prompt_dict]
                response = await client.chat.completions.create(
                    model=effective_model,
                    messages=messages_for_groq_openai,
                    temperature=0.2,
                    max_tokens=1024, # OpenAI SDK uses max_tokens
                )
                
                return response.choices[0].message.content

            else:
                raise HTTPException(status_code=400, detail=f"Unsupported LLM provider: {llm_provider}")

        except HTTPException: # Re-raise known HTTPExceptions
            raise
        except Exception as e:
            import traceback
            console.print(f"[red]Error during summarization with {llm_provider} for {website.url}: {e}[/red]")
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Error during summarization: {str(e)}")
        finally:
            console.print("Completed summarization i.e hitting the LLM")

# --- FastAPI App ---
app = FastAPI()

# Configure CORS with more specific settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Load config and summarizer once on startup
config = Config()
summarizer_service = LlmSummarizer(global_config=config)

class SummarizeRequest(BaseModel):
    url: str
    llm_provider: LLMProvider = Field(..., description="The LLM provider to use")
    api_key: Optional[str] = Field(None, description="API key for the selected LLM provider (if required)")
    model_name: Optional[str] = Field(None, description="Specific model name for the provider")
    base_url: Optional[str] = Field(None, description="Custom base URL for the LLM API")

@app.post("/summarize")
async def api_summarize_website(request: SummarizeRequest):
    console.print(f"Received request: URL='{request.url}', Provider='{request.llm_provider}', Model='{request.model_name}' HasAPIKey={'Yes' if request.api_key else 'No'}, BaseURL: {request.base_url}")
    try:
        import time
        start_time = time.time()
        
        summary_text = await summarizer_service.summarize(
            website_url=request.url,
            llm_provider=request.llm_provider,
            api_key=request.api_key,
            model_name=request.model_name,
            base_url=request.base_url
        )
        
        processing_time = f"{time.time() - start_time:.1f} seconds"
        
        return {
            "summary": summary_text,
            "metadata": {
                "url": request.url,
                "title": "Website Summary",
                "provider": request.llm_provider,
                "model": request.model_name or "default model",
                "processing_time": processing_time
            }
        }
    except HTTPException as e:
        console.print(f"[red]HTTPException for {request.url}: {e.detail}[/red]")
        raise e
    except Exception as e:
        console.print(f"[red]Unexpected error for {request.url}: {e}[/red]")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An unexpected server error occurred.")

@app.post("/summarize/stream")
async def api_summarize_website_stream(request: SummarizeRequest):
    console.print(f"Received streaming request: URL='{request.url}', Provider='{request.llm_provider}', Model='{request.model_name}' HasAPIKey={'Yes' if request.api_key else 'No'}, BaseURL: {request.base_url}")
    
    async def generate_stream():
        try:
            import time
            start_time = time.time()
            
            # First, scrape the website
            website = await Website.create(request.url)
            
            if "Could not scrape content" in website.text:
                yield f"data: {json.dumps({'error': f'Failed to process website content from: {website.url}'})}\n\n"
                return

            system_prompt_dict = summarizer_service._get_system_prompt()
            user_prompt_dict = summarizer_service._get_user_prompt(website)

            if request.llm_provider == "openai" or request.llm_provider == "deepseek":
                if not request.api_key:
                    yield f"data: {json.dumps({'error': 'API key is required for OpenAI.'})}\n\n"
                    return
                
                effective_model = request.model_name or "deepseek-chat" if request.llm_provider == "deepseek" else "gpt-4o-mini"
                client = AsyncOpenAI(api_key=request.api_key, base_url=request.base_url if request.llm_provider == "openai" else "https://api.deepseek.com")
                messages_for_openai = [system_prompt_dict, user_prompt_dict]
                
                try:
                    stream = await client.chat.completions.create(
                        model=effective_model,
                        messages=messages_for_openai,
                        temperature=0.2,
                        max_tokens=1024,
                        stream=True
                    )
                    
                    async for chunk in stream:
                        if chunk.choices[0].delta.content is not None:
                            yield f"data: {json.dumps({'content': chunk.choices[0].delta.content.replace('markdown', '')})}\n\n"
                    
                    processing_time = f"{time.time() - start_time:.1f} seconds"
                    yield f"data: {json.dumps({'done': True, 'metadata': {'url': request.url, 'title': website.title, 'provider': request.llm_provider, 'model': effective_model, 'processing_time': processing_time}})}\n\n"
                    
                except Exception as e:
                    yield f"data: {json.dumps({'error': f'Error during OpenAI streaming: {str(e)}'})}\n\n"
            
            else:
                # For non-OpenAI providers, fall back to regular summarization
                summary_text = await summarizer_service.summarize(
                    website_url=request.url,
                    llm_provider=request.llm_provider,
                    api_key=request.api_key,
                    model_name=request.model_name,
                    base_url=request.base_url
                )
                yield f"data: {json.dumps({'content': summary_text})}\n\n"
                
                processing_time = f"{time.time() - start_time:.1f} seconds"
                yield f"data: {json.dumps({'done': True, 'metadata': {'url': request.url, 'title': website.title, 'provider': request.llm_provider, 'model': request.model_name or 'default model', 'processing_time': processing_time}})}\n\n"
                
        except Exception as e:
            yield f"data: {json.dumps({'error': f'Unexpected error: {str(e)}'})}\n\n"

    return StreamingResponse(
        generate_stream(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream",
        }
    )

# Add a health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}

# To run this locally (for testing the API):
# uvicorn main_api:app --reload