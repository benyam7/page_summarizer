"use client"

import { motion } from "framer-motion"

interface ProcessStepsProps {
  currentStep: number
}

export const ProcessSteps = ({ currentStep }: ProcessStepsProps) => {
  const steps = [
    { id: 0, name: "Fetching", description: "Getting website content" },
    { id: 1, name: "Analyzing", description: "Processing page structure" },
    { id: 2, name: "Extracting", description: "Finding key information" },
    { id: 3, name: "Generating", description: "Creating AI summary" },
    { id: 4, name: "Finalizing", description: "Preparing results" },
  ]

  return (
    <div className="mb-4">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-zinc-200 dark:bg-zinc-700">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                  currentStep >= step.id
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                }`}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: currentStep >= step.id ? 1 : 0.8,
                  opacity: currentStep >= step.id ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                {currentStep > step.id ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs">{step.id + 1}</span>
                )}
              </motion.div>

              <motion.div
                className="mt-2 text-center"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: currentStep === step.id ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                <p
                  className={`text-xs font-medium ${
                    currentStep === step.id
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {step.name}
                </p>
                {currentStep === step.id && (
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 max-w-[60px]">{step.description}</p>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
