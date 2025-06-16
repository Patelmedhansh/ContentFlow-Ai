# ✨ ContentFlow AI — Automate Your Content Like a Pro!

**ContentFlow AI** is a smart automation tool that streamlines the journey from raw content to SEO-optimized publication. Built during **WeMakeDevs Hack Week** with **Kestra** and powered by **OpenAI**, it's designed for creators who want to publish better and faster — with zero friction.

![ContentFlow AI Banner](https://your-image-link.com/banner.png) <!-- Optional banner -->

---

## 🚀 What It Does

Give us your draft content — we'll turn it into:

✅ SEO-optimized title  
✅ Meta description (under 160 chars)  
✅ AI-generated summary  
✅ Social-ready posts for Twitter & LinkedIn  
✅ Auto-committed blog post to GitHub  
✅ Optional Discord/Twitter notification

---

## 🛠️ Built With

- ⚙️ [**Kestra**](https://kestra.io) — Open source workflow orchestration
- 🤖 [**OpenAI GPT-4 API**](https://openai.com/api) — For content enrichment
- 🧩 **Bolt.new** — For generating frontend UI
- 🧠 Custom Kestra flows (YAML-based)
- 🛜 GitHub (for blog publishing)
- 💬 Optional: Discord + Zapier integrations

---

## 🌐 Live Demo (Optional)

Watch the project in action:  
[![Watch Video](https://img.shields.io/badge/YouTube-Demo-red)](https://your-demo-link.com)

---

## 🧩 Architecture Overview

```plaintext
User Submits Content ➝ Bolt Frontend ➝ OpenAI API
                ⬇
     JSON Sent to Kestra Webhook
                ⬇
Kestra Flow:
   ▪ Format Markdown
   ▪ Generate Metadata
   ▪ Push to GitHub Repo
   ▪ Notify via Discord/Twitter
```

---

## 🎯 Features

### Frontend (React + TypeScript)
- **Modern UI**: Beautiful gradient backgrounds with card-based layouts
- **Content Input**: Support for both text input and markdown file uploads
- **Tone Selection**: Choose between professional, witty, or technical tones
- **Real-time Processing**: Loading animations and progress indicators
- **Copy to Clipboard**: One-click copying for all generated content
- **Responsive Design**: Works seamlessly across all devices

### AI-Powered Content Generation
- **SEO Optimization**: Automatically generates SEO-friendly titles and meta descriptions
- **Content Summarization**: Creates concise bullet-point summaries
- **Social Media Posts**: Generates platform-specific content for Twitter and LinkedIn
- **Tone Adaptation**: Adjusts content style based on selected tone

### Workflow Automation
- **Kestra Integration**: Seamless webhook integration for workflow orchestration
- **Error Handling**: Comprehensive error management with user-friendly alerts
- **Success Notifications**: Real-time feedback on workflow completion

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- OpenAI API key
- Kestra webhook URL (optional for full workflow)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/contentflow-ai.git
   cd contentflow-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_KESTRA_WEBHOOK_URL=https://your-kestra-webhook-url.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

---

## 📝 Usage

1. **Input Content**: Paste your raw content or upload a markdown file
2. **Select Tone**: Choose the desired tone for your content (professional, witty, technical)
3. **Run AI Workflow**: Click the "Run AI Workflow" button to process your content
4. **Review Results**: View the generated SEO title, meta description, summary, and social posts
5. **Copy & Use**: Use the copy buttons to grab any generated content
6. **Workflow Automation**: The system automatically sends enriched content to your Kestra workflow

---

## 🔧 Configuration

### OpenAI API Setup
1. Visit [OpenAI API](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env` file as `VITE_OPENAI_API_KEY`

### Kestra Webhook Setup
1. Set up your Kestra instance
2. Create a webhook trigger in your workflow
3. Add the webhook URL to your `.env` file as `VITE_KESTRA_WEBHOOK_URL`

---

## 📊 API Integration

### OpenAI Integration
The application uses GPT-4 for content generation with structured prompts:

- **SEO Title**: Generates optimized titles under 60 characters
- **Meta Description**: Creates descriptions under 160 characters
- **Content Summary**: Produces 3 concise bullet points
- **Social Posts**: Creates platform-specific content for Twitter and LinkedIn

### Webhook Payload
The system sends the following JSON structure to your Kestra webhook:

```json
{
  "title": "Generated SEO title",
  "meta": "Generated meta description",
  "summary": ["Summary point 1", "Summary point 2", "Summary point 3"],
  "posts": {
    "twitter": "Generated Twitter post",
    "linkedin": "Generated LinkedIn post"
  },
  "original": "Original user content",
  "tone": "Selected tone"
}
```

---

## 🎨 Design Philosophy

ContentFlow AI follows modern design principles:

- **Clean & Minimal**: Focused on content with minimal distractions
- **Accessible**: High contrast ratios and keyboard navigation support
- **Responsive**: Mobile-first design that works on all screen sizes
- **Performant**: Optimized loading and smooth animations
- **Professional**: Production-ready interface suitable for business use

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **WeMakeDevs Hack Week** for the inspiration and platform
- **Kestra** for the powerful workflow orchestration
- **OpenAI** for the incredible GPT-4 API
- **Bolt.new** for rapid frontend development
- The open-source community for amazing tools and libraries

---

## 📞 Support

If you have any questions or need help:

- 📧 Email: support@contentflow-ai.com
- 💬 Discord: [Join our community](https://discord.gg/your-invite)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/contentflow-ai/issues)

---

**Made with ❤️ during WeMakeDevs Hack Week**