"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface BreedSelectorProps {
  selectedBreed: string
  onSelectBreed: (provider: "openai" | "ollama" | "anthropic" | "google" | "groq") => void
}

interface BreedInfo {
  id: "openai" | "ollama" | "anthropic" | "google" | "groq"
  name: string
  breed: string
  description: string
  color: string
  emoji: string
}

export const BreedSelector = ({ selectedBreed, onSelectBreed }: BreedSelectorProps) => {
  const [expanded, setExpanded] = useState(false)

  const breeds: BreedInfo[] = [
    {
      id: "openai",
      name: "OpenAI",
      breed: "Golden Retriever",
      description: "Smart and reliable, great at fetching!",
      color: "bg-gradient-to-br from-yellow-400 to-orange-500",
      emoji: "🦮",
    },
    {
      id: "ollama",
      name: "Ollama",
      breed: "Border Collie",
      description: "Works locally, very intelligent",
      color: "bg-gradient-to-br from-blue-400 to-blue-600",
      emoji: "🐕‍🦺",
    },
    {
      id: "anthropic",
      name: "Anthropic",
      breed: "German Shepherd",
      description: "Thoughtful and detailed analysis",
      color: "bg-gradient-to-br from-orange-400 to-red-500",
      emoji: "🐕",
    },
    {
      id: "google",
      name: "Google",
      breed: "Labrador",
      description: "Fast and energetic fetcher",
      color: "bg-gradient-to-br from-red-400 to-pink-500",
      emoji: "🐶",
    },
    {
      id: "groq",
      name: "Groq",
      breed: "Greyhound",
      description: "Lightning fast inference",
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
      emoji: "🐕‍🦺",
    },
  ]

  const selectedBreedInfo = breeds.find((b) => b.id === selectedBreed) || breeds[0]

  return (
    <div className="mb-4">
      <div className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
        <span>🐕</span>
        Choose Your Doggo Breed
      </div>

      <div className="relative">
        {/* Selected Breed Card */}
        <div className="relative z-10 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <motion.div
            className={`flex items-center gap-3 p-3 rounded-2xl border-2 border-amber-300 dark:border-amber-600 bg-white/80 dark:bg-amber-900/20 ${expanded ? "rounded-b-none" : ""}`}
            animate={{
              backgroundColor: expanded ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.8)",
              borderColor: expanded ? "rgba(217, 119, 6, 1)" : "rgba(252, 211, 77, 1)",
            }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedBreedInfo.color} text-2xl shadow-lg`}
            >
              {selectedBreedInfo.emoji}
            </div>
            <div className="flex-1">
              <p className="font-bold text-amber-900 dark:text-amber-100">{selectedBreedInfo.breed}</p>
              <p className="text-xs text-amber-700 dark:text-amber-300">{selectedBreedInfo.description}</p>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-5 h-5 text-amber-600 dark:text-amber-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* Breed Options */}
        <motion.div
          className="absolute left-0 right-0 z-20 overflow-hidden bg-white/90 dark:bg-amber-900/80 border-2 border-t-0 border-amber-300 dark:border-amber-600 rounded-b-2xl shadow-lg backdrop-blur-sm"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: expanded ? "auto" : 0,
            opacity: expanded ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          {breeds.map(
            (breed) =>
              breed.id !== selectedBreed && (
                <div
                  key={breed.id}
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-800/30 transition-colors"
                  onClick={() => {
                    onSelectBreed(breed.id)
                    setExpanded(false)
                  }}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${breed.color} text-2xl shadow-lg`}
                  >
                    {breed.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-amber-900 dark:text-amber-100">{breed.breed}</p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">{breed.description}</p>
                  </div>
                </div>
              ),
          )}
        </motion.div>
      </div>

      {/* Breed Pills */}
      <div className="flex flex-wrap gap-2 mt-3">
        {breeds.map((breed) => (
          <motion.button
            key={breed.id}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors border-2 ${
              selectedBreed === breed.id
                ? "bg-amber-600 text-white border-amber-700 dark:bg-amber-500 dark:border-amber-400"
                : "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 dark:bg-amber-800/50 dark:text-amber-200 dark:border-amber-600 dark:hover:bg-amber-700/50"
            }`}
            onClick={() => onSelectBreed(breed.id)}
            whileTap={{ scale: 0.97 }}
          >
            {selectedBreed === breed.id && <Check className="w-3 h-3" />}
            <span>{breed.emoji}</span>
            {breed.name}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
