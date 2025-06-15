'use client';

import { AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface ErrorProps {
    detail: string;
    onBackToForm: () => void;
}

export const DoggoError = ({ detail, onBackToForm }: ErrorProps) => {
    return (
        <motion.div
            className="m-4 px-4 py-3 flex items-center gap-3 text-sm text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/20 rounded-2xl border-2 border-red-300 dark:border-red-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="text-2xl">😢</div>
            <div className="flex-1">
                <p className="font-medium">Oops! Something went wrong!</p>
                <p className="text-xs">{detail}</p>
            </div>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <Button
                variant="outline"
                size="sm"
                onClick={onBackToForm}
                className="flex items-center gap-1 bg-amber-100 dark:bg-amber-800/50 border-2 border-amber-300 dark:border-amber-600 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-700/50 rounded-xl"
            >
                <ArrowLeft className="w-4 h-4" />
                🏠 Back Home
            </Button>
        </motion.div>
    );
};
