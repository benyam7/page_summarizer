"use client"

import { useState } from "react"
import { SummarizerHeader } from "./summarizer-header"
import { SummarizerForm } from "./summarizer-form"
import { StickFigureAnimation } from "./stick-figure-animation"
import { SummaryResults } from "./summary-results"
import { ErrorDisplay } from "./error-display"
import { ProviderSelector } from "./provider-selector"
import { ProcessSteps } from "./process-steps"

interface SummaryRequest {
  url: string
  llm_provider: "openai" | "ollama" | "anthropic" | "google" | "groq"
  api_key: string
  model_name: string | null
  base_url: string | null
}

interface SummaryResponse {
  summary: string
  metadata: {
    url: string
    title: string
    provider: string
    model: string
    processing_time: string
  }
}

export default function WebsiteSummarizerApp() {
  const [showForm, setShowForm] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [request, setRequest] = useState<SummaryRequest>({
    url: "",
    llm_provider: "openai",
    api_key: "",
    model_name: null,
    base_url: null,
  })

  const handleProviderChange = (provider: "openai" | "ollama" | "anthropic" | "google" | "groq") => {
    setRequest((prev) => ({
      ...prev,
      llm_provider: provider,
      model_name: getDefaultModel(provider),
      base_url: provider === "ollama" ? "http://localhost:11434/v1" : null,
    }))
  }

  const getDefaultModel = (provider: string) => {
    const defaults = {
      openai: "gpt-4o-mini",
      ollama: "gemma2:9b",
      anthropic: "claude-3-haiku-20240307",
      google: "gemini-1.5-flash-latest",
      groq: "llama3-8b-8192",
    }
    return defaults[provider as keyof typeof defaults]
  }

  const handleSubmit = async (formData: SummaryRequest) => {
    setShowForm(false)
    setIsLoading(true)
    setError(null)
    setRequest(formData)
    setCurrentStep(0)

    try {
      // Simulate the different steps of the process
      const steps = [
        "Fetching website content",
        "Analyzing page structure",
        "Extracting key information",
        "Generating summary with AI",
        "Finalizing results",
      ]

      for (let i = 0; i < steps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 3000))
        setCurrentStep(i + 1)
      }

      // Simulate API response
      const mockResponse: SummaryResponse = {
        summary: `This is a summary of the website ${formData.url}. The content has been analyzed using ${formData.llm_provider} with the model ${formData.model_name || "default"}. 

The website appears to be about technology and innovation, discussing various aspects of modern computing and digital transformation. Key points include:

• Cloud computing benefits and implementation strategies
• AI integration in business processes and decision-making
• Best practices for digital security and data protection
• Case studies of successful digital transformations
• Future trends in technology and their potential impact

The site provides comprehensive resources for organizations looking to modernize their technology stack and leverage data-driven insights for competitive advantage.`,
        metadata: {
          url: formData.url,
          title: "Technology & Innovation Hub",
          provider: formData.llm_provider,
          model: formData.model_name || "default model",
          processing_time: "15.3 seconds",
        },
      }

      setSummaryData(mockResponse)
    } catch (err) {
      setError("Failed to summarize website. Please check your inputs and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToForm = () => {
    setShowForm(true)
    setError(null)
    setSummaryData(null)
  }

  return (
    <div className="group relative overflow-hidden w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] min-h-[600px] flex flex-col justify-between gap-2">
      <SummarizerHeader />
      <div className="flex-1 overflow-hidden flex flex-col">
        {error && <ErrorDisplay error={error} />}

        {showForm ? (
          <>
            <div className="p-4 pb-0">
              <ProviderSelector selectedProvider={request.llm_provider} onSelectProvider={handleProviderChange} />
            </div>
            <SummarizerForm onSubmit={handleSubmit} initialValues={request} selectedProvider={request.llm_provider} />
          </>
        ) : (
          <div className="p-4 flex-1 flex flex-col">
            {isLoading ? (
              <>
                <ProcessSteps currentStep={currentStep} />
                <StickFigureAnimation />
              </>
            ) : (
              <SummaryResults summaryData={summaryData} onBackToForm={handleBackToForm} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
