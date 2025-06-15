# 🐕 Web-Doggo - Your Faithful Website Fetching Companion

Web-Doggo is a delightful dog-themed web application that fetches AI-powered summaries of any website. Watch your faithful digital companion run, dig, and fetch comprehensive summaries using your preferred LLM provider!

## 🦴 Features

-   **🐕‍🦺 Multiple Doggo Breeds**: Choose from 5 different AI providers, each represented by a unique dog breed
-   **🎾 Interactive Animations**: Watch your doggo run through a beautiful playground while fetching summaries
-   **🦴 Bone-shaped Progress**: Visual progress tracking with paw prints and bone-shaped indicators
-   **🏠 Dog House Interface**: Charming dog house-themed UI with warm, inviting colors
-   **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
-   **🌙 Dark Mode Support**: Beautiful dark theme for comfortable viewing

## 🐕 Supported Doggo Breeds (LLM Providers)

| Breed               | Provider  | Default Model           | Description                            |
| ------------------- | --------- | ----------------------- | -------------------------------------- |
| 🦮 Golden Retriever | OpenAI    | gpt-4o-mini             | Smart and reliable, great at fetching! |
| 🐕‍🦺 Border Collie    | Ollama    | gemma2:9b               | Works locally, very intelligent        |
| 🐕 German Shepherd  | Anthropic | claude-3-haiku-20240307 | Thoughtful and detailed analysis       |
| 🐶 Labrador         | Google    | gemini-1.5-flash-latest | Fast and energetic fetcher             |
| 🐕‍🦺 Greyhound        | Groq      | llama3-8b-8192          | Lightning fast inference               |

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+
-   npm or yarn
-   API keys for your preferred LLM provider(s)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/web-doggo.git
   cd web-doggo
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install

    # or

    yarn install
    \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev

    # or

    yarn dev
    \`\`\`

4. **Open your browser**
   Navigate to \`http://localhost:3000\` and start fetching summaries with your doggo!

## 🦴 How to Use Web-Doggo

1. **🐕 Choose Your Doggo Breed**: Select your preferred AI provider from the breed selector
2. **🌐 Give the Website to Fetch**: Enter the URL you want summarized
3. **🦴 Provide API Treats**: Enter your API key for the selected provider
4. **🎾 Watch the Magic**: Enjoy the animation as your doggo fetches the summary!

### Example Usage

\`\`\`
Website: https://techcrunch.com
Breed: Golden Retriever (OpenAI)
API Key: your-openai-api-key
Result: A tail-wagging summary with paw-some insights! 🐾
\`\`\`

## 🏗️ API Integration

Web-Doggo supports multiple LLM providers through a unified interface:

### OpenAI

\`\`\`json
{
"url": "https://example.com",
"llm_provider": "openai",
"api_key": "your-openai-api-key",
"model_name": "gpt-4o-mini",
"base_url": null
}
\`\`\`

### Ollama (Local)

\`\`\`json
{
"url": "https://example.com",
"llm_provider": "ollama",
"api_key": "ollama",
"model_name": "gemma2:9b",
"base_url": "http://localhost:11434/v1"
}
\`\`\`

### Anthropic

\`\`\`json
{
"url": "https://example.com",
"llm_provider": "anthropic",
"api_key": "your-anthropic-api-key",
"model_name": "claude-3-haiku-20240307",
"base_url": null
}
\`\`\`

### Google

\`\`\`json
{
"url": "https://example.com",
"llm_provider": "google",
"api_key": "your-google-api-key",
"model_name": "gemini-1.5-flash-latest",
"base_url": null
}
\`\`\`

### Groq

\`\`\`json
{
"url": "https://example.com",
"llm_provider": "groq",
"api_key": "your-groq-api-key",
"model_name": "llama3-8b-8192",
"base_url": null
}
\`\`\`

## 🛠️ Tech Stack

-   **Frontend**: Next.js 14, React 18, TypeScript
-   **Styling**: Tailwind CSS, Framer Motion
-   **UI Components**: shadcn/ui
-   **Icons**: Lucide React
-   **Animations**: Framer Motion, CSS animations

## 🎨 Customization

### Changing Dog Breeds

You can customize the dog breeds and their associated providers in \`breed-selector.tsx\`:

\`\`\`typescript
const breeds: BreedInfo[] = [
{
id: "openai",
name: "OpenAI",
breed: "Golden Retriever",
description: "Smart and reliable, great at fetching!",
color: "bg-gradient-to-br from-yellow-400 to-orange-500",
emoji: "🦮",
},
// Add more breeds...
]
\`\`\`

### Customizing Colors

The color scheme can be modified in the Tailwind classes throughout the components. The main color palette uses:

-   Primary: Amber (\`amber-500\`, \`amber-600\`, etc.)
-   Secondary: Orange (\`orange-500\`, \`orange-600\`, etc.)
-   Accent: Green (\`green-500\`, \`green-600\`, etc.)

## 🐕‍🦺 Contributing

We welcome contributions to make Web-Doggo even more paw-some! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: \`git checkout -b feature/amazing-feature\`
3. **Commit your changes**: \`git commit -m 'Add amazing feature'\`
4. **Push to the branch**: \`git push origin feature/amazing-feature\`
5. **Open a Pull Request**

### Development Guidelines

-   Follow the existing code style and conventions
-   Add appropriate TypeScript types
-   Test your changes thoroughly
-   Update documentation as needed
-   Keep the dog theme consistent! 🐕

## 🐾 Roadmap

-   [ ] 🔊 Add dog sound effects (barking, panting, happy yips)
-   [ ] 🦮 Breed-specific animations and characteristics
-   [ ] 🦴 Dog treats reward system
-   [ ] 🎓 Dog training mode (tutorial)
-   [ ] 🏞️ Dog park social features
-   [ ] 📱 Mobile app version
-   [ ] 🌍 Multi-language support
-   [ ] 🎨 Custom dog avatar creator

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   Built with ❤️ and lots of dog treats
-   Inspired by the loyalty and enthusiasm of our four-legged friends
-   Special thanks to all the good doggos who provided moral support during development

## 🐕 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/web-doggo/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Made with 🐾 by dog lovers, for dog lovers!**

_Remember: A good doggo always fetches the best summaries! 🦴_
