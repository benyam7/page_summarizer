import WebsiteSummarizerApp from "@/components/website-summarizer/website-summarizer-app"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent mb-4">
            Website Summarizer
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Get AI-powered summaries of any website using your preferred LLM provider
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Component Demo */}
          <div className="flex justify-center">
            <WebsiteSummarizerApp />
          </div>

          {/* Usage Instructions */}
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">How to Use</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-md">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Choose Your Provider</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Select from OpenAI, Ollama, Anthropic, Google, or Groq using the card selector
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-md">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Enter Website URL</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Paste the URL of any website you want to summarize
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-md">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Add API Key</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Enter your API key for the selected provider
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-md">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Watch the Magic</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Enjoy the stick figure animation while AI processes your request
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Supported Providers */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Supported Providers</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">OpenAI</p>
                    <p className="text-xs text-zinc-500">GPT-4o Mini</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">O</span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">Ollama</p>
                    <p className="text-xs text-zinc-500">Gemma2:9b</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-orange-50 dark:from-orange-900/20 dark:to-orange-900/20 rounded-lg border border-orange-200/50 dark:border-orange-800/50">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">Anthropic</p>
                    <p className="text-xs text-zinc-500">Claude 3 Haiku</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/20 rounded-lg border border-red-200/50 dark:border-red-800/50">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">Google</p>
                    <p className="text-xs text-zinc-500">Gemini 1.5 Flash</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/20 rounded-lg border border-purple-200/50 dark:border-purple-800/50 col-span-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">Groq</p>
                    <p className="text-xs text-zinc-500">Llama3-8b-8192</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Usage */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Sample Usage</h2>
              <div className="space-y-3">
                <div className="p-3 bg-zinc-50/80 dark:bg-zinc-800/80 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">URL:</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">https://techcrunch.com</p>
                </div>
                <div className="p-3 bg-zinc-50/80 dark:bg-zinc-800/80 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Provider:</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">OpenAI (GPT-4o Mini)</p>
                </div>
                <div className="p-3 bg-zinc-50/80 dark:bg-zinc-800/80 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Expected Output:</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    AI-generated summary of the latest tech news and articles from TechCrunch
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
