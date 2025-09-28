# Zenith Note
A minimalist, PWA chat interface to conversationally manage your knowledge base, inspired by Obsidian.
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/praburajasekaran/chat-ui-obsidian-fc)
## About The Project
Zenith Note is a stunning, minimalist Progressive Web App (PWA) designed as a conversational interface for knowledge management, simulating an interaction with an Obsidian vault. It provides a clean, focused chat UI that allows users to create, find, and link notes using natural language. The application is built for a mobile-first experience, making it perfect for capturing thoughts on the go.
It leverages a powerful AI backend to interpret commands and provide intelligent responses, acting as a personal knowledge assistant. The UI is meticulously crafted with a focus on simplicity, usability, and visual elegance, featuring a calming color palette, fluid animations, and a distraction-free layout.
## Key Features
-   **Conversational Interface**: Interact with your knowledge base using natural language.
-   **AI-Powered Assistant**: An intelligent agent helps create, find, link, and summarize notes.
-   **Progressive Web App (PWA)**: Installable on your mobile device for a native-like experience.
-   **Minimalist & Focused UI**: A clean, distraction-free design to help you focus on your thoughts.
-   **Mobile-First & Responsive**: Flawlessly designed for on-the-go use on any device.
-   **Light & Dark Modes**: Beautifully crafted themes to suit your preference.
-   **Markdown Support**: The AI assistant uses Markdown syntax, including Obsidian-style `[[wiki-links]]`.
## Technology Stack
-   **Frontend**: React, Vite, TypeScript
-   **Styling**: Tailwind CSS, shadcn/ui
-   **Animation**: Framer Motion
-   **Icons**: Lucide React
-   **Backend**: Cloudflare Workers, Hono
-   **Stateful Agents**: Cloudflare Agents (Durable Objects)
-   **AI**: Cloudflare AI Gateway
## Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.
### Prerequisites
-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/) package manager
-   A Cloudflare account
### Installation
1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/zenith-note.git
    cd zenith-note
    ```
2.  **Install dependencies:**
    ```sh
    bun install
    ```
## ⚠️ Critical Setup: Configure AI Gateway
**THE CHATBOT WILL NOT WORK UNTIL YOU COMPLETE THIS STEP.**
This project uses Cloudflare's AI Gateway to power the chat assistant. You must configure your Cloudflare credentials for the application to function.
### 1. For Local Development
Create a file named `.dev.vars` in the root directory of the project. Add your Cloudflare Account ID, Gateway ID, and an API Key with AI permissions:
```ini
# .dev.vars
CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
CF_AI_API_KEY="YOUR_CLOUDFLARE_API_KEY"
```
### 2. For Production Deployment
When you deploy to Cloudflare Workers, you must set these as secrets in your Worker's settings.
1.  Navigate to your Worker in the Cloudflare dashboard.
2.  Go to **Settings** > **Variables**.
3.  Under **Environment Variables**, add the following secrets:
    -   `CF_AI_BASE_URL`: `https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai`
    -   `CF_AI_API_KEY`: `YOUR_CLOUDFLARE_API_KEY`
4.  Click **Encrypt** for each secret to secure them.
5.  Redeploy your worker for the changes to take effect.