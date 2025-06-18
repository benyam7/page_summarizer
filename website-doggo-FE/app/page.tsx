import WebDoggoApp from '@/components/web-doggo/web-doggo-app';

export default function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-amber-50 to-orange-100 dark:from-green-900/30 dark:via-amber-900/20 dark:to-orange-900/30 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-800 via-orange-600 to-amber-800 dark:from-amber-400 dark:via-orange-400 dark:to-amber-400 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-4">
                        <span className="text-5xl md:text-7xl">🐕</span>
                        Web-Doggo
                        <span className="text-5xl md:text-7xl">🦴</span>
                    </h1>
                    <p className="text-lg md:text-xl text-amber-700 dark:text-amber-300 max-w-2xl mx-auto">
                        Your faithful companion for fetching AI-powered website
                        summaries! 🐾
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Component Demo */}
                    <div className="flex justify-center">
                        <WebDoggoApp />
                    </div>

                    {/* Usage Instructions */}
                    <div className="space-y-6">
                        <div className="bg-white/80 dark:bg-amber-900/30 backdrop-blur-sm rounded-3xl p-6 border-4 border-amber-300 dark:border-amber-600 shadow-lg">
                            <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                                <span>🐕‍🦺</span>
                                How to Train Your Web-Doggo
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                        🐕
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-amber-900 dark:text-amber-100">
                                            Choose Your Doggo Breed
                                        </h3>
                                        <p className="text-sm text-amber-700 dark:text-amber-300">
                                            Pick from Golden Retriever (OpenAI),
                                            Border Collie (Ollama), German
                                            Shepherd (Anthropic), Labrador
                                            (Google), or Greyhound (Groq)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                        🌐
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-amber-900 dark:text-amber-100">
                                            Give the Website to Fetch
                                        </h3>
                                        <p className="text-sm text-amber-700 dark:text-amber-300">
                                            Enter the URL you want your doggo to
                                            fetch and summarize
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                        🦴
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-amber-900 dark:text-amber-100">
                                            Provide API Treats
                                        </h3>
                                        <p className="text-sm text-amber-700 dark:text-amber-300">
                                            Give your doggo the API key treats
                                            they need to fetch the summary
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                        🎾
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-amber-900 dark:text-amber-100">
                                            Watch the Magic Happen
                                        </h3>
                                        <p className="text-sm text-amber-700 dark:text-amber-300">
                                            Enjoy watching your doggo run, dig,
                                            and fetch your summary!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Supported Breeds */}
                        <div className="bg-white/80 dark:bg-amber-900/30 backdrop-blur-sm rounded-3xl p-6 border-4 border-amber-300 dark:border-amber-600 shadow-lg">
                            <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                                <span>🐕‍🦺</span>
                                Available Doggo Breeds
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl border-2 border-yellow-300 dark:border-yellow-600">
                                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                                        🦮
                                    </div>
                                    <div>
                                        <p className="font-bold text-amber-900 dark:text-amber-100">
                                            Golden Retriever (OpenAI)
                                        </p>
                                        <p className="text-xs text-amber-700 dark:text-amber-300">
                                            Smart and reliable, great at
                                            fetching!
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-100 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/30 rounded-2xl border-2 border-blue-300 dark:border-blue-600">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
                                        🐕‍🦺
                                    </div>
                                    <div>
                                        <p className="font-bold text-amber-900 dark:text-amber-100">
                                            Border Collie (Ollama)
                                        </p>
                                        <p className="text-xs text-amber-700 dark:text-amber-300">
                                            Works locally, very intelligent
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl border-2 border-orange-300 dark:border-orange-600">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                                        🐕
                                    </div>
                                    <div>
                                        <p className="font-bold text-amber-900 dark:text-amber-100">
                                            German Shepherd (Anthropic)
                                        </p>
                                        <p className="text-xs text-amber-700 dark:text-amber-300">
                                            Thoughtful and detailed analysis
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-2xl border-2 border-red-300 dark:border-red-600">
                                    <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                                        🐶
                                    </div>
                                    <div>
                                        <p className="font-bold text-amber-900 dark:text-amber-100">
                                            Labrador (Google)
                                        </p>
                                        <p className="text-xs text-amber-700 dark:text-amber-300">
                                            Fast and energetic fetcher
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-100 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/30 rounded-2xl border-2 border-purple-300 dark:border-purple-600">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
                                        🐕‍🦺
                                    </div>
                                    <div>
                                        <p className="font-bold text-amber-900 dark:text-amber-100">
                                            Greyhound (Groq)
                                        </p>
                                        <p className="text-xs text-amber-700 dark:text-amber-300">
                                            Lightning fast inference
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-100 to-green-100 dark:from-purple-900/30 dark:to-purple-900/30 rounded-2xl border-2 border-purple-300 dark:border-purple-600">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
                                        🐕‍🦺
                                    </div>
                                    <div>
                                        <p className="font-bold text-amber-900 dark:text-amber-100">
                                            Husky (DeepSeek)
                                        </p>
                                        <p className="text-xs text-amber-700 dark:text-amber-300">
                                            Powerful and efficient worker
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sample Usage */}
                        <div className="bg-white/80 dark:bg-amber-900/30 backdrop-blur-sm rounded-3xl p-6 border-4 border-amber-300 dark:border-amber-600 shadow-lg">
                            <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                                <span>🎾</span>
                                Sample Fetch Mission
                            </h2>
                            <div className="space-y-3">
                                <div className="p-3 bg-amber-100/80 dark:bg-amber-800/30 rounded-2xl border-2 border-amber-200 dark:border-amber-700">
                                    <p className="text-sm font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                                        <span>🌐</span>
                                        Website to Fetch:
                                    </p>
                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                        https://techcrunch.com
                                    </p>
                                </div>
                                <div className="p-3 bg-amber-100/80 dark:bg-amber-800/30 rounded-2xl border-2 border-amber-200 dark:border-amber-700">
                                    <p className="text-sm font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                                        <span>🦮</span>
                                        Doggo Breed:
                                    </p>
                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                        Golden Retriever (OpenAI GPT-4o Mini)
                                    </p>
                                </div>
                                <div className="p-3 bg-amber-100/80 dark:bg-amber-800/30 rounded-2xl border-2 border-amber-200 dark:border-amber-700">
                                    <p className="text-sm font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                                        <span>🦴</span>
                                        Expected Result:
                                    </p>
                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                        A tail-wagging summary of the latest
                                        tech news with paw-some insights! 🐾
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
