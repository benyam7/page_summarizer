"use client"

import { motion } from "framer-motion"

interface FetchStepsProps {
  currentStep: number
}

export const FetchSteps = ({ currentStep }: FetchStepsProps) => {
  const steps = [
    { id: 0, name: "Sniffing", description: "Finding the website", emoji: "👃" },
    { id: 1, name: "Digging", description: "Extracting content", emoji: "🕳️" },
    { id: 2, name: "Chasing", description: "Gathering information", emoji: "🏃‍♂️" },
    { id: 3, name: "Fetching", description: "Getting AI summary", emoji: "🦴" },
    { id: 4, name: "Returning", description: "Bringing results", emoji: "🎾" },
  ]

  return (
    <div className="mb-4">
      <div className="relative">
        {/* Bone-shaped Progress Bar */}
        <div className="absolute top-6 left-0 w-full h-2 bg-amber-200 dark:bg-amber-700 rounded-full">
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-amber-200 dark:bg-amber-700 rounded-full"></div>
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-amber-200 dark:bg-amber-700 rounded-full"></div>
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full relative"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
          </motion.div>
        </div>

        {/* Paw Print Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 text-lg shadow-lg ${
                  currentStep >= step.id
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    : "bg-amber-200 dark:bg-amber-700 text-amber-600 dark:text-amber-300"
                }`}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: currentStep >= step.id ? 1 : 0.8,
                  opacity: currentStep >= step.id ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                {currentStep > step.id ? "🐾" : step.emoji}
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
                  className={`text-xs font-bold ${
                    currentStep === step.id
                      ? "text-amber-700 dark:text-amber-300"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {step.name}
                </p>
                {currentStep === step.id && (
                  <p className="text-[10px] text-amber-500 dark:text-amber-400 max-w-[60px]">{step.description}</p>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
