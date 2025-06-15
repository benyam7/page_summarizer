'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Globe, Sparkles, Key } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';

interface SummaryRequest {
    url: string;
    llm_provider: 'openai' | 'ollama' | 'anthropic' | 'google' | 'groq';
    api_key: string;
    model_name: string | null;
    base_url: string | null;
}

interface FormProps {
    onSubmit: (data: SummaryRequest) => void;
    initialValues: SummaryRequest;
    selectedProvider: string;
}

const DEFAULT_MODELS = {
    openai: 'gpt-4o-mini',
    ollama: 'gemma2:9b',
    anthropic: 'claude-3-haiku-20240307',
    google: 'gemini-1.5-flash-latest',
    groq: 'llama3-8b-8192',
};

export const DoggoForm = ({
    onSubmit,
    initialValues,
    selectedProvider,
}: FormProps) => {
    const [formData, setFormData] = useState<SummaryRequest>(initialValues);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update form data when provider changes
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            llm_provider: selectedProvider as SummaryRequest['llm_provider'],
            model_name:
                DEFAULT_MODELS[selectedProvider as keyof typeof DEFAULT_MODELS],
            base_url:
                selectedProvider === 'ollama'
                    ? 'http://localhost:11434/v1'
                    : null,
        }));
    }, [selectedProvider]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Small delay to show the button animation
        await new Promise((resolve) => setTimeout(resolve, 500));

        onSubmit(formData);
        setIsSubmitting(false);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 flex-1 p-4 pt-0 justify-between"
        >
            <div className="space-y-4">
                {/* URL Input - Dog Bowl Style */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🌐</span>
                        <Label
                            htmlFor="url"
                            className="text-sm text-amber-800 dark:text-amber-200 font-medium"
                        >
                            Website to Fetch
                        </Label>
                    </div>
                    <div className="relative">
                        <Input
                            id="url"
                            type="url"
                            value={formData.url}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    url: e.target.value,
                                })
                            }
                            placeholder="https://example.com"
                            required
                            className="w-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-300 dark:border-amber-600 text-sm text-amber-900 dark:text-amber-100 placeholder:text-amber-500 rounded-2xl focus:outline-none focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:border-amber-600 dark:focus-visible:border-amber-400 pl-10 h-12"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500">
                            <Globe className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* API Key - Treat Container Style */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🦴</span>
                        <Label
                            htmlFor="apiKey"
                            className="text-sm text-amber-800 dark:text-amber-200 font-medium"
                        >
                            API Treat (Key)
                        </Label>
                    </div>
                    <div className="relative">
                        <Input
                            id="apiKey"
                            type="password"
                            value={formData.api_key}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    api_key: e.target.value,
                                })
                            }
                            placeholder={`Enter your ${selectedProvider} API key`}
                            required
                            className="w-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-300 dark:border-amber-600 text-sm text-amber-900 dark:text-amber-100 placeholder:text-amber-500 rounded-2xl focus:outline-none focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:border-amber-600 dark:focus-visible:border-amber-400 pl-10 h-12"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500">
                            <Key className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Advanced Settings - Dog House */}
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem
                        value="advanced-settings"
                        className="border-b-0"
                    >
                        <AccordionTrigger className="py-2 text-sm text-amber-700 dark:text-amber-300 hover:no-underline font-medium">
                            🏠 Advanced Doggo Settings
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl p-3">
                            {/* Model Name */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="modelName"
                                    className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2"
                                >
                                    <span>🎾</span>
                                    Model Name (Optional)
                                </Label>
                                <Input
                                    id="modelName"
                                    type="text"
                                    value={formData.model_name || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            model_name: e.target.value || null,
                                        })
                                    }
                                    placeholder={
                                        DEFAULT_MODELS[
                                            formData.llm_provider as keyof typeof DEFAULT_MODELS
                                        ]
                                    }
                                    className="w-full bg-white/80 dark:bg-amber-800/30 border-2 border-amber-200 dark:border-amber-700 text-sm text-amber-900 dark:text-amber-100 placeholder:text-amber-500 rounded-xl focus:outline-none focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:border-amber-500 dark:focus-visible:border-amber-400"
                                />
                            </div>

                            {/* Base URL */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="baseUrl"
                                    className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2"
                                >
                                    <span>🏠</span>
                                    Base URL{' '}
                                    {formData.llm_provider === 'ollama' &&
                                        '(Required for Ollama)'}
                                </Label>
                                <Input
                                    id="baseUrl"
                                    type="text"
                                    value={formData.base_url || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            base_url: e.target.value || null,
                                        })
                                    }
                                    placeholder={
                                        formData.llm_provider === 'ollama'
                                            ? 'http://localhost:11434/v1'
                                            : 'Default API endpoint'
                                    }
                                    required={
                                        formData.llm_provider === 'ollama'
                                    }
                                    className="w-full bg-white/80 dark:bg-amber-800/30 border-2 border-amber-200 dark:border-amber-700 text-sm text-amber-900 dark:text-amber-100 placeholder:text-amber-500 rounded-xl focus:outline-none focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:border-amber-500 dark:focus-visible:border-amber-400"
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Bone-shaped Fetch Button */}
            <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 dark:from-amber-500 dark:to-orange-500 dark:hover:from-amber-600 dark:hover:to-orange-600 text-white text-sm font-bold rounded-full transition-all duration-300 self-end overflow-hidden relative shadow-lg border-2 border-amber-700 dark:border-amber-400"
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 1 }}
                animate={{
                    opacity: isSubmitting ? 0.8 : 1,
                }}
                style={{
                    clipPath:
                        'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
                }}
            >
                {isSubmitting ? (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="flex items-center gap-2">
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <span>Fetching...</span>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5" />
                        <span>🐕 Fetch Summary! 🦴</span>
                    </>
                )}
            </motion.button>
        </form>
    );
};
