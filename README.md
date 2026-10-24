# MediGuide AI 

**An AI-powered health education assistant built with React, Node.js, Express, and Google Gemini.**

MediGuide AI helps users explore general health information, learn healthy everyday habits, and prepare for conversations with healthcare professionals.

## ✨ Features

- **AI Health Q&A:** Ask general health education questions and receive simple, easy-to-understand responses.
- **Explore Health Topics:** Learn about sleep, hydration, healthy eating, and daily physical activity.
- **Doctor Visit Preparation:** Get general guidance on preparing questions and information for a healthcare appointment.
- **Safety-Focused Responses:** Provides immediate safety guidance for certain recognized emergency-related keywords.
- **Responsive Interface:** A clean interface designed to make health information easier to explore.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express.js
- **AI Integration:** Google Gemini API
- **Configuration:** dotenv
- **Development Tools:** Visual Studio Code, npm

## ⚙️ Run Locally

### Prerequisites

- Node.js and npm
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd mediguide-ai
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual repository URL after publishing.

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure the backend

Navigate to the backend folder and install its dependencies:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder and add your Gemini API key:

```dotenv
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace the placeholder with your own key. **Never publish your actual API key.**

### 4. Start the backend

From the `server` folder, run:

```bash
node index.js
```

### 5. Start the frontend

Open a second terminal in the main project folder and run:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🔐 Security

- API credentials are stored in environment variables.
- `.env` files are excluded through `.gitignore`.
- The Gemini API key must remain on the backend and must never be exposed in frontend code.

## 🩺 Health & Safety Disclaimer

MediGuide AI is an educational project, not a medical professional. It does not replace professional medical advice, diagnosis, or treatment.

Its emergency keyword detection is limited and may miss emergencies or incorrectly flag other questions. Do not rely on this feature to determine whether a situation is safe. If you may be experiencing a medical emergency, contact local emergency services immediately.

AI-generated information can be incomplete or inaccurate. Consult a qualified healthcare professional for personal medical concerns.

## 🚧 Limitations

- Responses depend on the availability and performance of the Gemini API.
- AI-generated health information may not always be accurate.
- Emergency keyword detection is a basic safeguard, not a comprehensive emergency detection system.
- A valid API key and internet connection are required for AI-generated responses.

## 🎯 Project Goal

The goal of MediGuide AI is to explore how generative AI can make general health education more accessible while encouraging users to seek qualified professional care when needed.

---

**Built as an AI-powered health education project.**