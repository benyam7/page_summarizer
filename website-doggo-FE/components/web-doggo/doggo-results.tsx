'use client';

import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Markdown from 'react-markdown';

interface SummaryResponse {
    summary: string;
    metadata: {
        url: string;
        title: string;
        provider: string;
        model: string;
        processing_time: string;
    };
    error?: string;
}

interface DoggoResultsProps {
    summaryData: SummaryResponse | null;
    onBackToForm: () => void;
}

export const DoggoResults = ({
    summaryData,
    onBackToForm,
}: DoggoResultsProps) => {
    if (!summaryData) return null;

    console.log(summaryData);

    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob(
            [
                `# 🐕 Web-Doggo Summary
                of ${
                    summaryData.metadata.title || 'website-doggo-results'
                }\n\n` +
                    `🌐 URL: ${summaryData.metadata.url}\n` +
                    `🦮 Generated with: ${summaryData.metadata.provider} (${summaryData.metadata.model})\n` +
                    `⏱️ Fetch time: ${summaryData.metadata.processing_time}\n\n` +
                    `## 🦴 Summary\n\n${summaryData.summary}\n\n` +
                    `---\n*Fetched by Web-Doggo - Your faithful website companion! 🐾*`,
            ],
            { type: 'text/plain' }
        );

        element.href = URL.createObjectURL(file);
        element.download = `web-doggo-summary-${
            new Date().toISOString().split('T')[0]
        }.md`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <motion.div
            className="flex flex-col gap-4 h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Happy Dog Header */}
            <div className="text-center">
                <motion.div
                    className="text-4xl mb-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                    }}
                >
                    🐕
                </motion.div>
                <p className="text-sm font-bold text-amber-800 dark:text-amber-200">
                    Woof! I brought back your summary! 🦴
                </p>
            </div>

            <div className="flex items-center justify-between">
                <Badge
                    variant="outline"
                    className="px-3 py-1 text-xs bg-amber-100 dark:bg-amber-800/50 border-amber-300 dark:border-amber-600 text-amber-800 dark:text-amber-200"
                >
                    🦮 {summaryData.metadata.provider} /{' '}
                    {summaryData.metadata.model}
                </Badge>
                <Badge
                    variant="outline"
                    className="px-3 py-1 text-xs bg-green-100 dark:bg-green-800/50 border-green-300 dark:border-green-600 text-green-800 dark:text-green-200"
                >
                    ⏱️ {summaryData.metadata.processing_time}
                </Badge>
            </div>

            <Card className="flex-1 overflow-auto bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-300 dark:border-amber-600">
                <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-amber-900 dark:text-amber-100 flex items-center gap-2">
                        <span>📄</span>
                        {summaryData.metadata.title}
                    </h3>
                    <a
                        href={summaryData.metadata.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mb-4 hover:underline"
                    >
                        {summaryData.metadata.url}
                        <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="prose prose-sm dark:prose-invert max-w-none text-amber-900 dark:text-amber-100">
                        <div className="whitespace-pre-wrap">
                            <Markdown>
                                {summaryData.summary
                                    .replace('```markdown', '')
                                    .replace('```', '')}
                            </Markdown>
                            {summaryData.metadata.processing_time ===
                                'Streaming...' && (
                                <span className="inline-block w-2 h-4 bg-amber-600 dark:bg-amber-400 ml-1 animate-pulse"></span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-2 mt-auto">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onBackToForm}
                    className="flex items-center gap-1 bg-amber-100 dark:bg-amber-800/50 border-2 border-amber-300 dark:border-amber-600 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-700/50 rounded-xl"
                >
                    <ArrowLeft className="w-4 h-4" />
                    🏠 Back Home
                </Button>

                <Button
                    variant="default"
                    size="sm"
                    onClick={handleDownload}
                    className="flex items-center gap-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-2 border-amber-700 rounded-xl"
                >
                    <Download className="w-4 h-4" />
                    🦴 Save Summary
                </Button>
            </div>
        </motion.div>
    );
};
