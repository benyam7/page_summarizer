# main_api.py (your new Python API file)
import dotenv
import asyncio
import os
os.environ['PYPPETEER_CHROMIUM_REVISION'] = '1263111' # Keep this if it works for your deployment

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware # For allowing Next.js to call
from pydantic import BaseModel
from rich.console import Console
from rich.markdown import Markdown # You might not use Rich directly in API responses
from openai import OpenAI
from openai.types.chat import ChatCompletion
from typing import Optional, Union, Dict, List
from pyppeteer import launch
from pyppeteer_stealth import stealth
from random import randint

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
    async def scrape_async(self) -> None: # Renamed and made async
        """
        Scrape the website using pyppeteer.
        """
        browser = None # Initialize to ensure it's defined in finally
        page = None
        try:
            browser = await launch(
                headless=True,
                args=[
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-extensions'
                ],
                ignoreHTTPSErrors=True,
                executablePath='/usr/bin/chromium'  # Use the system Chromium we installed
            )
            page = await browser.newPage()
            await stealth(page)

            user_agents: List[str] = [
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15",
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
            ]
            ua = user_agents[randint(0, len(user_agents) - 1)]
            await page.setUserAgent(ua)
            await page.setRequestInterception(True)

            # Be careful with lambda and ensure_future in this context.
            # It's often cleaner to define the handler separately.
            async def intercept_request(req):
                if req.resourceType == "stylesheet":
                    await req.abort()
                else:
                    await req.continue_()
            page.on("request", intercept_request)

            await page.goto(self.__url, {"timeout": 60000}) # Use self.__url directly
            self.__title = await page.title()
            self.__text = await page.evaluate('() => document.body.innerText')
        except Exception as e:
            console.print(f"[red]Error scraping {self.__url}: {e}[/red]")
            # Propagate the error or set text to an error message
            self.__title = "Error"
            self.__text = f"Could not scrape content: {str(e)}"
            raise # Re-raise the exception so FastAPI can catch it as a server error
        finally:
            if page:
                await page.close()
            if browser:
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


class LlmSummarizer:
    # ... (LlmSummarizer class remains largely the same) ...
    #region Config
    __config: Config
    @property
    def config(self) -> Config:
        if not hasattr(self, '_LlmSummarizer__config') or self.__config is None:
            raise ValueError("Config not initialized")
        return self.__config
    #endregion

    #region OpenAI
    __openai: OpenAI = None

    @property
    def openai(self) -> OpenAI:
        if self.__openai is None:
            self.__openai = OpenAI(base_url='http://localhost:11434/v1', api_key='ollama')
        return self.__openai
    #endregion

    #region System behavior
    __system_behavior: Dict[str, str] = None
    @property
    def system_behavior(self) -> Dict[str, str]:
        if self.__system_behavior is None:
            self.__system_behavior = {
                "role": "system",
                "content": (
                    "You are an assistant that analyzes the contents of a website "
                    "and provides a short summary, ignoring the text that might be navigation-related."
                    "Respond in markdown and be concise."
                )
            }
        return self.__system_behavior
    #endregion

    #region user_prompt_for
    def user_prompt_for(self, website: Website) -> Dict[str, str]:
        user_prompt_content: str = (
            f"You are looking at the website titled \"{website.title}\". "
            "The content of this website is as follows; "
            "please provide a short summary of this website in markdown. "
            "If it includes news or announcements, then summarize these too.\n\n"
            f"\"\"\"\n{website.text}\n\"\"\"\n\n"
        )
        return {
            "role": "user",
            "content": user_prompt_content
        }
    #endregion

    #region messages_for
    def messages_for(self, website: Website) -> List[Dict[str, str]]:
        return [
            self.system_behavior,
            self.user_prompt_for(website)
        ]
    #endregion

    #region summarize
    # This method now needs to be async if Website.create is async
    async def summarize(self, website_url_or_instance: Union[Website, str]) -> Optional[str]:
        website: Website
        if isinstance(website_url_or_instance, str):
            try:
                # Use the async factory method
                website = await Website.create(website_url_or_instance)
            except Exception as e:
                console.print(f"[red]Failed to scrape website {website_url_or_instance}: {e}[/red]")
                raise HTTPException(status_code=500, detail=f"Failed to scrape website: {str(e)}")

        else:
            website = website_url_or_instance
        
        if "Could not scrape content" in website.text: # Check if scraping failed
             raise HTTPException(status_code=500, detail=f"Failed to scrape website: {website.url}")


        messages: List[Dict[str, str]] = self.messages_for(website)
        try:
            # The OpenAI client's create method might be synchronous by default
            # If you're using openai >v1.0, it's sync. You can run it in a thread pool executor
            # or use an async OpenAI client if available and you want full async.
            # For simplicity with FastAPI, running sync SDK call in threadpool is common.
            loop = asyncio.get_event_loop()
            response: ChatCompletion = await loop.run_in_executor(
                None, # Uses default ThreadPoolExecutor
                lambda: self.openai.chat.completions.create(
                    model="gemma3:4b",
                    messages=messages,
                    temperature=0.2,
                    max_tokens=1024, # Increased for potentially longer summaries
                )
            )
            return response.choices[0].message.content
        except Exception as e:
            console.print(f"[red]Error summarizing {website.url}: {e}[/red]")
            raise HTTPException(status_code=500, detail=f"Error during summarization: {str(e)}")

    #endregion
    
    def __init__(self, config: Config) -> None:
        self.__config = config

# --- FastAPI App ---
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Or specify your Next.js app's domain for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load config and summarizer once on startup
config = Config()
summarizer = LlmSummarizer(config)

class SummarizeRequest(BaseModel):
    url: str

class SummarizeResponse(BaseModel):
    summary: Optional[str]
    error: Optional[str] = None

@app.post("/summarize", response_model=SummarizeResponse)
async def api_summarize_website(request: SummarizeRequest):
    console.print(f"Received request to summarize: {request.url}")
    try:
        summary_text = await summarizer.summarize(request.url)
        if summary_text:
            return SummarizeResponse(summary=summary_text)
        else:
            # This case might not be hit if summarize raises HTTPException for errors
            return SummarizeResponse(summary=None, error="Could not generate summary.")
    except HTTPException as e: # Catch HTTPExceptions raised by summarize
        console.print(f"[red]HTTPException for {request.url}: {e.detail}[/red]")
        raise e # Re-raise it so FastAPI handles it
    except Exception as e:
        console.print(f"[red]Unexpected error for {request.url}: {e}[/red]")
        # Log the full traceback for debugging
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

# To run this locally (for testing the API):
# uvicorn main_api:app --reload