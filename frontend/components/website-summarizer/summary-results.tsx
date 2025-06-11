"use client"

import { ArrowLeft, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SummaryResponse {
  summary: string
  metadata: {
    url: string
    title: string
    provider: string
    model: string
    processing_time: string
  }
}

interface SummaryResultsProps {
  summaryData: SummaryResponse | null
  onBackToForm: () => void
}

export const SummaryResults = ({ summaryData, onBackToForm }: SummaryResultsProps) => {
  if (!summaryData) return null

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob(
      [
        `# Summary of ${summaryData.metadata.title}\n\n` +
          `URL: ${summaryData.metadata.url}\n` +
          `Generated with: ${summaryData.metadata.provider} (${summaryData.metadata.model})\n` +
          `Processing time: ${summaryData.metadata.processing_time}\n\n` +
          `## Summary\n\n${summaryData.summary}`,
      ],
      { type: "text/plain" },
    )

    element.href = URL.createObjectURL(file)
    element.download = `summary-${new Date().toISOString().split("T")[0]}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="px-2 py-1 text-xs">
          {summaryData.metadata.provider} / {summaryData.metadata.model}
        </Badge>
        <Badge variant="outline" className="px-2 py-1 text-xs">
          {summaryData.metadata.processing_time}
        </Badge>
      </div>

      <Card className="flex-1 overflow-auto">
        <CardContent className="p-4">
          <h3 className="font-medium text-lg mb-2">{summaryData.metadata.title}</h3>
          <a
            href={summaryData.metadata.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-4 hover:underline"
          >
            {summaryData.metadata.url}
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>{summaryData.summary}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-2 mt-auto">
        <Button variant="outline" size="sm" onClick={onBackToForm} className="flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Button variant="default" size="sm" onClick={handleDownload} className="flex items-center gap-1">
          <Download className="w-4 h-4" />
          Download Summary
        </Button>
      </div>
    </div>
  )
}
