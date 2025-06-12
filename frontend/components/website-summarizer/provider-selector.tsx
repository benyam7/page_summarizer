'use client';

import type React from 'react';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProviderSelectorProps {
    selectedProvider: string;
    onSelectProvider: (
        provider: 'openai' | 'ollama' | 'anthropic' | 'google' | 'groq'
    ) => void;
}

interface ProviderInfo {
    id: 'openai' | 'ollama' | 'anthropic' | 'google' | 'groq';
    name: string;
    description: string;
    color: string;
    logo: React.ReactNode;
}

export const ProviderSelector = ({
    selectedProvider,
    onSelectProvider,
}: ProviderSelectorProps) => {
    const [expanded, setExpanded] = useState(false);

    const providers: ProviderInfo[] = [
        {
            id: 'openai',
            name: 'OpenAI',
            description: 'GPT-4o and other powerful models',
            color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
            logo: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.5093-2.6067-1.4997z" />
                </svg>
            ),
        },
        {
            id: 'ollama',
            name: 'Ollama',
            description: 'Run open models locally',
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
            logo: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-3.5l6-4.5-6-4.5z" />
                </svg>
            ),
        },
        {
            id: 'anthropic',
            name: 'Anthropic',
            description: 'Claude models for detailed analysis',
            color: 'bg-gradient-to-br from-orange-500 to-orange-600',
            logo: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.328L20 9v6l-8 4-8-4V9l8-4.672zM12 6L6 9l6 3 6-3-6-3z" />
                </svg>
            ),
        },
        {
            id: 'google',
            name: 'Google',
            description: 'Gemini models for advanced AI',
            color: 'bg-gradient-to-br from-red-500 to-red-600',
            logo: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
            ),
        },
        {
            id: 'groq',
            name: 'Groq',
            description: 'Fast inference for LLama models',
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            logo: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16h-2v-6h2v6zm4 0h-2v-6h2v6zm1-9.5h-2.5V6H9v2.5H6.5V11H9v2.5h2.5V11H14V8.5z" />
                </svg>
            ),
        },
    ];

    const selectedProviderInfo =
        providers.find((p) => p.id === selectedProvider) || providers[0];
    console.log('selectedProviderInfo', selectedProviderInfo);
    return (
        <div className="mb-4">
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Select LLM Provider
            </div>

            <div className="relative">
                {/* Selected Provider Card (Always visible) */}
                <div
                    className="relative z-10 cursor-pointer"
                    onClick={() => setExpanded(!expanded)}
                >
                    <motion.div
                        className={`flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 ${
                            expanded ? 'rounded-b-none' : ''
                        }`}
                        animate={{
                            backgroundColor: expanded
                                ? 'rgba(244, 244, 245, 0.8)'
                                : 'rgba(255, 255, 255, 0)',
                            borderColor: expanded
                                ? 'rgba(228, 228, 231, 1)'
                                : 'rgba(228, 228, 231, 0.5)',
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedProviderInfo.color}`}
                        >
                            {selectedProviderInfo.logo}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                {selectedProviderInfo.name}
                            </p>
                            <p className="text-xs text-zinc-500">
                                {selectedProviderInfo.description}
                            </p>
                        </div>
                        <motion.div
                            animate={{ rotate: expanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-5 h-5 text-zinc-400"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Provider Options */}
                <motion.div
                    className="absolute left-0 right-0 z-20 overflow-hidden bg-white dark:bg-zinc-800 border border-t-0 border-zinc-200 dark:border-zinc-700 rounded-b-xl shadow-lg"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                        height: expanded ? 'auto' : 0,
                        opacity: expanded ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                >
                    {providers.map(
                        (provider) =>
                            provider.id !== selectedProvider && (
                                <div
                                    key={provider.id}
                                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                                    onClick={() => {
                                        onSelectProvider(provider.id);
                                        setExpanded(false);
                                    }}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${provider.color}`}
                                    >
                                        {provider.logo}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                            {provider.name}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {provider.description}
                                        </p>
                                    </div>
                                </div>
                            )
                    )}
                </motion.div>
            </div>

            {/* Provider Pills (Alternative compact view) */}
            <div className="flex flex-wrap gap-2 mt-3">
                {providers.map((provider) => (
                    <motion.button
                        key={provider.id}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
                            selectedProvider === provider.id
                                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                        }`}
                        onClick={() => onSelectProvider(provider.id)}
                        whileTap={{ scale: 0.97 }}
                    >
                        {selectedProvider === provider.id && (
                            <Check className="w-3 h-3" />
                        )}
                        {provider.name}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
