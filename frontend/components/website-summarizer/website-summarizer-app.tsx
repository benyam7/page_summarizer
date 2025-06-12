'use client';

import { useState } from 'react';
import { SummarizerHeader } from './summarizer-header';
import { SummarizerForm } from './summarizer-form';
import { StickFigureAnimation } from './stick-figure-animation';
import { SummaryResults } from './summary-results';
import { ErrorDisplay } from './error-display';
import { ProviderSelector } from './provider-selector';
import { ProcessSteps } from './process-steps';

interface SummaryRequest {
    url: string;
    llm_provider: 'openai' | 'ollama' | 'anthropic' | 'google' | 'groq';
    api_key: string;
    model_name: string | null;
    base_url: string | null;
}

interface SummaryResponse {
    summary: string;
    metadata: {
        url: string;
        title: string;
        provider: string;
        model: string;
        processing_time: string;
    };
}

export default function WebsiteSummarizerApp() {
    const [showForm, setShowForm] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [summaryData, setSummaryData] = useState<SummaryResponse | null>(
        null
    );
    const [currentStep, setCurrentStep] = useState(0);
    const [request, setRequest] = useState<SummaryRequest>({
        url: '',
        llm_provider: 'openai',
        api_key: '',
        model_name: null,
        base_url: null,
    });

    const handleProviderChange = (
        provider: 'openai' | 'ollama' | 'anthropic' | 'google' | 'groq'
    ) => {
        const model = getDefaultModel(provider);
        const baseUrl =
            provider === 'ollama' ? 'http://localhost:11434/v1' : null;

        setRequest((prev) => {
            const updated = {
                ...prev,
                llm_provider: provider,
                model_name: model,
                base_url: baseUrl,
            };
            return updated;
        });
    };

    const getDefaultModel = (provider: string) => {
        const defaults = {
            openai: 'gpt-4o-mini',
            ollama: 'gemma2:9b',
            anthropic: 'claude-3-haiku-20240307',
            google: 'gemini-1.5-flash-latest',
            groq: 'llama3-8b-8192',
        };
        return defaults[provider as keyof typeof defaults];
    };

    const handleSubmit = async (formData: SummaryRequest) => {
        setShowForm(false);
        setIsLoading(true);
        setError(null);
        setRequest(formData);
        setCurrentStep(0);
        console.log('formData', formData);

        try {
            // Start with fetching website content
            setCurrentStep(1);

            const response = await fetch(
                'https://page-sum-from-gh-656961743998.europe-west1.run.app/summarize',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Analyzing and extracting steps
            setCurrentStep(2);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setCurrentStep(3);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const data = await response.json();

            // Generating summary step
            setCurrentStep(4);

            const summaryResponse: SummaryResponse = {
                summary: data.summary,
                metadata: {
                    url: formData.url,
                    title: new URL(formData.url).hostname,
                    provider: formData.llm_provider,
                    model: formData.model_name || 'default model',
                    processing_time: 'Completed',
                },
            };

            // Finalizing step
            setCurrentStep(5);
            setSummaryData(summaryResponse);
        } catch (error) {
            console.error('Error:', error);
            setError(
                'Failed to summarize website. Please check your inputs and try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToForm = () => {
        setShowForm(true);
        setError(null);
        setSummaryData(null);
    };

    return (
        <div className="group relative overflow-hidden w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] min-h-[600px] flex flex-col justify-between gap-2">
            <SummarizerHeader />
            <div className="flex-1 overflow-hidden flex flex-col">
                {error && <ErrorDisplay error={error} />}

                {showForm ? (
                    <>
                        <div className="p-4 pb-0">
                            <ProviderSelector
                                selectedProvider={request.llm_provider}
                                onSelectProvider={handleProviderChange}
                            />
                        </div>
                        <SummarizerForm
                            onSubmit={handleSubmit}
                            initialValues={request}
                            selectedProvider={request.llm_provider}
                        />
                    </>
                ) : (
                    <div className="p-4 flex-1 flex flex-col">
                        {isLoading ? (
                            <>
                                <ProcessSteps currentStep={currentStep} />
                                <StickFigureAnimation />
                            </>
                        ) : (
                            <SummaryResults
                                summaryData={summaryData}
                                onBackToForm={handleBackToForm}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
