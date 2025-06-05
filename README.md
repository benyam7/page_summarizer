# Web Page Summarizer FastAPI using LLMs and Pyppeteer

This project provides a service to scrape text content from a given URL and generate a concise summary using various Large Language Models (LLMs). It features a Python (FastAPI) backend for the scraping and LLM interaction, and a Next.js frontend for the user interface.

## Features

-   **Web Scraping:** Uses Pyppeteer (headless Chrome) to fetch and extract text content from websites.
-   **Multi-LLM Support:** Integrates with multiple LLM providers:
    -   OpenAI (e.g., GPT-4o-mini, GPT-3.5-turbo)
    -   Google Generative AI (e.g., Gemini 1.5 Flash)
    -   Anthropic (e.g., Claude 3 Haiku)
    -   Groq (Fast inference for models like Llama3)
    -   Ollama (Self-hosted open-source models)
-   **User-Provided API Keys:** Users can leverage their own API keys for the chosen LLM provider via the frontend.
-   **Customizable Models:** Users can specify the model name for the selected provider.
-   **Dockerized Backend:** The FastAPI backend is containerized for easy deployment.
-   **Cloud Run Deployment:** Instructions for deploying the backend API to Google Cloud Run.
-   **Next.js Frontend:** A simple UI built with Next.js for interacting with the summarizer.

## Project Structure

```
.
├── backend/                # Python FastAPI application
│   ├── main_api.py        # FastAPI application logic, scraping, LLM interaction
│   ├── Dockerfile         # Docker configuration for the backend
│   ├── requirements.txt   # Python dependencies
│   ├── .env.example      # Example environment variables for backend
│   └── ...               # Other Python files/modules if any
├── frontend/              # Next.js application
│   ├── app/              # Next.js App Router directory
│   │   └── page.tsx      # Main page component with the UI form
│   ├── public/
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   └── .env.local.example # Example environment variables for frontend
└── README.md             # This file
```

## Prerequisites

### Backend (Python / FastAPI / Docker)

-   Python 3.10+
-   Docker & Docker Compose (optional, for local Docker management)
-   Access to an LLM provider API key (OpenAI, Google, Anthropic, Groq) or a running Ollama instance.
-   Google Cloud SDK (`gcloud`) if deploying to Cloud Run.

### Frontend (Next.js)

-   Node.js (LTS version recommended, e.g., 18.x or 20.x)
-   npm or yarn

## Setup & Running Locally

### 1. Backend API

#### a. Clone the repository:

```bash
git clone <your-repository-url>
cd <your-repository-url>/backend
```

#### b. Create a virtual environment and install dependencies:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### c. Configure Environment Variables:

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# Optional: Default base URL for Ollama if the frontend doesn't provide one
# OLLAMA_BASE_URL=http://localhost:11434/v1
```

#### d. Running the API with Uvicorn (Local Development):

```bash
uvicorn main_api:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000. You can access the OpenAPI docs at http://localhost:8000/docs.

#### e. Running the API with Docker:

```bash
# Build the Docker image
docker build -t summarizer-api .

# Run the Docker container
# If using Ollama running on your host machine:
# For Docker Desktop (Mac/Windows):
docker run -p 8000:8000 --rm -e OLLAMA_BASE_URL="http://host.docker.internal:11434/v1" --name summarizer-app summarizer-api

# For Docker on Linux (replace 172.17.0.1 with your docker0 bridge IP if different):
# docker run -p 8000:8000 --rm -e OLLAMA_BASE_URL="http://172.17.0.1:11434/v1" --name summarizer-app summarizer-api
```

### 2. Frontend UI

#### a. Navigate to the frontend directory:

```bash
cd ../frontend  # Assuming you are in the backend directory
```

#### b. Install dependencies:

```bash
npm install
# or
yarn install
```

#### c. Configure Environment Variables:

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```bash
# URL of your backend API
NEXT_PUBLIC_API_URL=http://localhost:8000 # For local backend development
# NEXT_PUBLIC_API_URL=YOUR_DEPLOYED_CLOUD_RUN_API_URL # For production
```

#### d. Run the Next.js development server:

```bash
npm run dev
# or
yarn dev
```

The frontend will be available at http://localhost:3000.

## API Usage

The backend exposes a single endpoint:

### POST /summarize

**Request Body (JSON):**

```json
{
    "url": "string (URL of the website to summarize)",
    "llm_provider": "string (one of: 'openai', 'ollama', 'anthropic', 'google', 'groq')",
    "api_key": "string (optional, API key for the provider if required)",
    "model_name": "string (optional, specific model name for the provider)",
    "base_url": "string (optional, custom base URL for LLM API, e.g., for Ollama or OpenAI proxies)"
}
```

**Success Response (200 OK):**

```json
{
    "summary": "string (The generated markdown summary)"
}
```

**Error Response (e.g., 400, 401, 500):**

```json
{
    "detail": "string (Description of the error)"
}
```

**Example cURL request:**

```bash
curl --location 'http://localhost:8000/summarize' \
--header 'Content-Type: application/json' \
--data '{
    "url": "https://example.com",
    "llm_provider": "openai",
    "api_key": "YOUR_OPENAI_API_KEY",
    "model_name": "gpt-4o-mini"
}'
```

## Deploying to Google Cloud Run

### Prerequisites:

1. Google Cloud Project with Billing enabled
2. gcloud CLI installed and initialized (`gcloud init`)
3. Enable required APIs:

```bash
gcloud services enable run.googleapis.com artifactregistry.googleapis.com
```

### Configure Artifact Registry:

```bash
export REGION="us-central1" # Choose your region
export REPO_NAME="summarizer-images" # Choose your repo name

gcloud artifacts repositories create ${REPO_NAME} \
    --repository-format=docker \
    --location=${REGION} \
    --description="Docker repository for summarizer API"

gcloud auth configure-docker ${REGION}-docker.pkg.dev
```

### Build and Push Docker Image:

```bash
export GCP_PROJECT_ID=$(gcloud config get-value project)
export IMAGE_NAME="summarizer-api"
export IMAGE_TAG="latest"
export IMAGE_URI="${REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:${IMAGE_TAG}"

docker build -t ${IMAGE_URI} .
docker push ${IMAGE_URI}
```

### Deploy to Cloud Run:

```bash
export SERVICE_NAME="website-summarizer-api"
export CLOUD_RUN_REGION="us-central1"

gcloud run deploy ${SERVICE_NAME} \
    --image=${IMAGE_URI} \
    --platform=managed \
    --region=${CLOUD_RUN_REGION} \
    --port=8000 \
    --allow-unauthenticated \
    --set-env-vars="PYPPETEER_EXECUTABLE_PATH=/usr/bin/chromium" \
    --cpu=1 \
    --memory=2Gi \
    --timeout=300s \
    --concurrency=10
```

## Deploying the Frontend

You can deploy the Next.js frontend to platforms like Vercel (recommended), Netlify, or others.

### Deploying to Vercel:

1. Push your project to a Git repository (GitHub, GitLab, Bitbucket)
2. Go to Vercel and sign up or log in
3. Click "New Project"
4. Import your Git repository
5. Configure Environment Variables:
    - Add `NEXT_PUBLIC_API_URL` with your Cloud Run API URL
6. Click "Deploy"

## Troubleshooting

### Backend Pyppeteer Issues:

-   Ensure Chromium dependencies are correctly installed in the Dockerfile
-   When running on Cloud Run, allocate sufficient memory (2GiB+) and CPU
-   Check Cloud Run logs for out-of-memory errors or browser crashes

### LLM API Key Errors:

-   Verify the correct API key is being sent from the frontend
-   Ensure the API key is valid and has not expired

### CORS Errors:

-   The FastAPI backend is configured with permissive CORS (`allow_origins=["*"]`)
-   For production, restrict this to your frontend's domain

### Ollama Connectivity:

-   Ensure the `base_url` correctly points to your Ollama instance
-   Verify network accessibility from the Docker container

## Future Enhancements

-   Add support for more LLM providers
-   Implement streaming responses for summaries
-   More advanced error handling and user feedback
-   Caching of scraped content or summaries
-   User authentication for saving preferences or history
-   Option to upload documents for summarization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```

```
