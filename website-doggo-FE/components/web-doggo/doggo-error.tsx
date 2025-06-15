"use client"

import { AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

interface ErrorProps {
  error: string
}

export const DoggoError = ({ error }: ErrorProps) => {
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
        <p className="text-xs">{error}</p>
      </div>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
    </motion.div>
  )
}
