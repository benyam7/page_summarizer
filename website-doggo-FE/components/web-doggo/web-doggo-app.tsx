'use client';

import { useState } from 'react';
import { DoggoHeader } from './doggo-header';
import { DoggoForm } from './doggo-form';
import { DoggoAnimation } from './doggo-animation';
import { DoggoResults } from './doggo-results';
import { DoggoError } from './doggo-error';
import { BreedSelector } from './breed-selector';
import { FetchSteps } from './fetch-steps';

interface SummaryRequest {
    url: string;
    llm_provider:
        | 'openai'
        | 'ollama'
        | 'anthropic'
        | 'google'
        | 'groq'
        | 'deepseek';
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
    detail?: string;
}

export default function WebDoggoApp() {
    const [showForm, setShowForm] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [summaryData, setSummaryData] = useState<SummaryResponse | null>(
        null
    );
    const [currentStep, setCurrentStep] = useState(0);
    const [request, setRequest] = useState<SummaryRequest>({
        url: '',
        llm_provider: 'google',
        api_key: process.env.GEMMA_API_KEY || '',
        model_name: null,
        base_url: null,
    });

    const handleBreedChange = (
        provider:
            | 'openai'
            | 'ollama'
            | 'anthropic'
            | 'google'
            | 'groq'
            | 'deepseek'
    ) => {
        setRequest((prev) => ({
            ...prev,
            llm_provider: provider,
            model_name: getDefaultModel(provider),
            base_url:
                provider === 'ollama' ? 'http://localhost:11434/v1' : null,
        }));
    };

    const getDefaultModel = (provider: string) => {
        const defaults = {
            openai: 'gpt-4o-mini',
            ollama: 'gemma2:9b',
            anthropic: 'claude-3-haiku-20240307',
            google: 'gemini-1.5-flash-latest',
            groq: 'llama3-8b-8192',
            deepseek: 'deepseek-chat',
        };
        return defaults[provider as keyof typeof defaults];
    };

    const handleFetch = async (formData: SummaryRequest) => {
        setShowForm(false);
        setIsFetching(true);
        setError(null);
        setRequest(formData);
        setCurrentStep(0);
        console.log('formData', formData);

        try {
            // Simulate the different steps of the fetching process
            const steps = [
                'Sniffing out the website',
                'Digging through the content',
                'Chasing down key information',
                'Fetching the AI summary',
                'Bringing back the results',
            ];

            for (let i = 0; i < steps.length; i++) {
                await new Promise((resolve) => setTimeout(resolve, 5000));
                setCurrentStep(i + 1);
            }

            // Use streaming for OpenAI, regular request for others
            if (
                formData.llm_provider === 'openai' ||
                formData.llm_provider === 'deepseek'
            ) {
                await handleStreamingRequest(formData);
            } else {
                await handleRegularRequest(formData);
            }
        } catch (err) {
            setError(
                'Woof! Make sure you have entered correct API key and model name. Let&apos;s try again! 🐕'
            );
        } finally {
            setIsFetching(false);
        }
    };

    const handleStreamingRequest = async (formData: SummaryRequest) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUMMARIZER_API_URL}/summarize/stream`,
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

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body');
        }

        let summaryText = '';
        const decoder = new TextDecoder();

        // Initialize summary data with empty content
        setSummaryData({
            summary: '',
            metadata: {
                url: formData.url,
                title: 'Loading...',
                provider: formData.llm_provider,
                model: formData.model_name || 'default model',
                processing_time: 'Streaming...',
            },
        });

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.error) {
                                setError(data.error);
                                return;
                            }

                            if (data.content) {
                                summaryText += data.content;
                                // Update the summary in real-time
                                setSummaryData((prev) =>
                                    prev
                                        ? {
                                              ...prev,
                                              summary: summaryText,
                                          }
                                        : null
                                );
                            }

                            if (data.done) {
                                // Final update with complete metadata
                                setSummaryData({
                                    summary: summaryText,
                                    metadata: data.metadata || {
                                        url: formData.url,
                                        title: 'Summary Complete',
                                        provider: formData.llm_provider,
                                        model:
                                            formData.model_name ||
                                            'default model',
                                        processing_time: 'Streamed',
                                    },
                                });
                                return;
                            }
                        } catch (e) {
                            console.error('Error parsing SSE data:', e);
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    };

    const handleRegularRequest = async (formData: SummaryRequest) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUMMARIZER_API_URL}/summarize`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            }
        );

        console.log('response', response.status);
        if (!response.ok) {
            console.log('response', await response.text());
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: SummaryResponse = await response.json();
        setSummaryData(data);
    };

    const handleBackToForm = () => {
        setShowForm(true);
        setError(null);
        setSummaryData(null);
    };

    return (
        <div className="doggo-house group relative overflow-hidden w-full max-w-md bg-gradient-to-b from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 border-4 border-amber-800 dark:border-amber-600 rounded-3xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(139,69,19,0.3)] dark:hover:shadow-[0_12px_40px_rgba(255,165,0,0.2)] min-h-[600px] flex flex-col justify-between gap-2 relative">
            {/* Dog House Roof */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[100px] border-r-[100px] border-b-[40px] border-l-transparent border-r-transparent border-b-red-600 dark:border-b-red-700"></div>
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[90px] border-r-[90px] border-b-[35px] border-l-transparent border-r-transparent border-b-red-500 dark:border-b-red-600"></div>

            {/* Paw Print Decorations */}
            <div className="absolute top-4 right-4 text-amber-800/20 dark:text-amber-400/20">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M12 2C10.9 2 10 2.9 10 4S10.9 6 12 6 14 5.1 14 4 13.1 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z" />
                </svg>
            </div>
            <div className="absolute bottom-4 left-4 text-amber-800/20 dark:text-amber-400/20 rotate-12">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M12 2C10.9 2 10 2.9 10 4S10.9 6 12 6 14 5.1 14 4 13.1 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z" />
                </svg>
            </div>

            <DoggoHeader />
            <div className="flex-1 overflow-hidden flex flex-col">
                {error && (
                    <DoggoError
                        detail={error}
                        onBackToForm={handleBackToForm}
                    />
                )}

                {showForm ? (
                    <>
                        <div className="p-4 pb-0">
                            <BreedSelector
                                selectedBreed={request.llm_provider}
                                onSelectBreed={handleBreedChange}
                            />
                        </div>
                        <DoggoForm
                            onSubmit={handleFetch}
                            initialValues={request}
                            selectedProvider={request.llm_provider}
                        />
                    </>
                ) : (
                    <div className="p-4 flex-1 flex flex-col">
                        {isFetching ? (
                            <>
                                <FetchSteps currentStep={currentStep} />
                                <DoggoAnimation />
                            </>
                        ) : (
                            <DoggoResults
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
