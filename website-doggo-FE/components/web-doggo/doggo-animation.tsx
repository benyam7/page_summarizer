"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export const DoggoAnimation = () => {
  const [progress, setProgress] = useState(0)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [dogAction, setDogAction] = useState("running")
  const [showBone, setShowBone] = useState(false)

  const loadingTexts = [
    "Sniffing out the website... 👃",
    "Digging through the content... 🕳️",
    "Chasing down key information... 🏃‍♂️",
    "Fetching the AI summary... 🦴",
    "Almost back with results... 🎾",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1))
    }, 150)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => {
        const next = (prev + 1) % loadingTexts.length
        // Change dog action based on current step
        if (next === 0) setDogAction("sniffing")
        else if (next === 1) setDogAction("digging")
        else if (next === 2) setDogAction("running")
        else if (next === 3) {
          setDogAction("fetching")
          setShowBone(true)
        } else if (next === 4) setDogAction("returning")
        return next
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="w-full h-full flex flex-col items-center justify-center border-0 shadow-none bg-transparent">
      <CardContent className="flex flex-col items-center gap-6 p-6 w-full">
        <div className="doggo-playground w-full h-48 relative rounded-2xl overflow-hidden bg-gradient-to-b from-green-200 via-green-300 to-green-400 dark:from-green-800 dark:via-green-700 dark:to-green-600 border-4 border-green-500 dark:border-green-400">
          {/* Clouds */}
          <div className="absolute top-4 left-8 w-12 h-6 bg-white dark:bg-gray-200 rounded-full opacity-80"></div>
          <div className="absolute top-6 left-16 w-8 h-4 bg-white dark:bg-gray-200 rounded-full opacity-60"></div>
          <div className="absolute top-2 right-12 w-10 h-5 bg-white dark:bg-gray-200 rounded-full opacity-70"></div>

          {/* Sun */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-400 rounded-full shadow-lg">
            <div className="absolute inset-1 bg-yellow-300 rounded-full"></div>
          </div>

          {/* Trees */}
          <div className="absolute bottom-12 left-4 w-4 h-8 bg-amber-800 dark:bg-amber-900"></div>
          <div className="absolute bottom-16 left-2 w-8 h-8 bg-green-600 dark:bg-green-700 rounded-full"></div>
          <div className="absolute bottom-12 right-8 w-4 h-8 bg-amber-800 dark:bg-amber-900"></div>
          <div className="absolute bottom-16 right-6 w-8 h-8 bg-green-600 dark:bg-green-700 rounded-full"></div>

          {/* Dog Character */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{
              x: dogAction === "running" ? [-20, 20, -20] : 0,
              y: dogAction === "digging" ? [0, 5, 0] : dogAction === "fetching" ? [0, -10, 0] : 0,
              rotate: dogAction === "sniffing" ? [0, -10, 10, 0] : 0,
            }}
            transition={{
              duration: dogAction === "running" ? 2 : dogAction === "digging" ? 1 : 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            {/* Dog Body */}
            <div className="relative">
              {/* Body */}
              <div className="w-12 h-8 bg-amber-700 dark:bg-amber-600 rounded-full relative">
                {/* Head */}
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-amber-700 dark:bg-amber-600 rounded-full">
                  {/* Eyes */}
                  <div className="absolute top-2 left-1 w-1 h-1 bg-black rounded-full"></div>
                  <div className="absolute top-2 right-1 w-1 h-1 bg-black rounded-full"></div>
                  {/* Nose */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full"></div>
                  {/* Ears */}
                  <div className="absolute -top-1 left-0 w-2 h-3 bg-amber-800 dark:bg-amber-700 rounded-full transform -rotate-45"></div>
                  <div className="absolute -top-1 right-0 w-2 h-3 bg-amber-800 dark:bg-amber-700 rounded-full transform rotate-45"></div>
                </div>

                {/* Tail */}
                <motion.div
                  className="absolute -right-2 top-1 w-4 h-2 bg-amber-700 dark:bg-amber-600 rounded-full origin-left"
                  animate={{ rotate: [0, 30, -30, 0] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                ></motion.div>

                {/* Legs */}
                <div className="absolute -bottom-2 left-1 w-1 h-3 bg-amber-800 dark:bg-amber-700"></div>
                <div className="absolute -bottom-2 left-3 w-1 h-3 bg-amber-800 dark:bg-amber-700"></div>
                <div className="absolute -bottom-2 right-3 w-1 h-3 bg-amber-800 dark:bg-amber-700"></div>
                <div className="absolute -bottom-2 right-1 w-1 h-3 bg-amber-800 dark:bg-amber-700"></div>
              </div>

              {/* Bone (when fetching) */}
              {showBone && (
                <motion.div
                  className="absolute -top-4 -right-6 w-6 h-2 bg-white rounded-full relative"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                </motion.div>
              )}

              {/* Action Effects */}
              {dogAction === "digging" && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="w-2 h-1 bg-amber-900 rounded-full"></div>
                  <div className="w-1 h-1 bg-amber-800 rounded-full ml-1 mt-1"></div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Ground */}
          <div className="absolute bottom-0 w-full h-8 bg-green-500 dark:bg-green-600"></div>
          <div className="absolute bottom-0 w-full h-2 bg-green-600 dark:bg-green-700"></div>

          {/* Flowers */}
          <div className="absolute bottom-8 left-8 w-2 h-2 bg-pink-400 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-1 h-4 bg-green-600"></div>
          <div className="absolute bottom-8 right-16 w-2 h-2 bg-yellow-400 rounded-full"></div>
          <div className="absolute bottom-10 right-18 w-1 h-4 bg-green-600"></div>
        </div>

        <div className="space-y-3 text-center w-full">
          <motion.p
            className="text-sm font-bold text-amber-800 dark:text-amber-200"
            key={currentTextIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {loadingTexts[currentTextIndex]}
          </motion.p>
          <p className="text-xs text-amber-600 dark:text-amber-400">Good doggo is working hard! 🐕</p>

          {/* Bone-shaped Progress Bar */}
          <div className="w-full h-3 bg-amber-200 dark:bg-amber-700 rounded-full overflow-hidden mt-4 relative">
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-amber-200 dark:bg-amber-700 rounded-full"></div>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-amber-200 dark:bg-amber-700 rounded-full"></div>
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 relative"
              style={{ width: `${progress}%` }}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
