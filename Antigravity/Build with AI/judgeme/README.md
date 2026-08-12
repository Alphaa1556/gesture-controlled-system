# ⚖️ JudgeMe: Same crime. Different face. Different fate.

<div align="center">
  <p><b>An AI-powered simulation exposing algorithmic bias in the justice system.</b></p>
</div>

## 🚨 The Problem
AI risk assessment tools (like COMPAS) are increasingly used in courts to recommend bail and sentencing severity. However, these tools are often trained on historical data that heavily correlates with socioeconomic status, neighborhood, and income. 

The result? Two people committing the exact same crime can receive wildly different risk scores simply because of their demographic background. This is a black-box problem that disproportionately harms marginalized communities.

## 💡 Our Solution
**JudgeMe** brings this algorithmic bias to the surface. It is an educational tool designed for developers, policymakers, and the public to visualize how AI models can silently discriminate.

You enter a base crime. The app then generates **four identical cases** but varies the defendant's socioeconomic proxies (income bracket and neighborhood). It concurrently runs all four profiles through the **Gemini 2.5 Flash** model and calculates a "Disparity Score." If the AI gives higher risk scores to lower-income profiles for the *exact same crime*, the bias is immediately exposed.

## 🚀 Features
- **Concurrent AI Profiling:** Uses `asyncio` and Google's Generative AI SDK to evaluate 4 demographic variants simultaneously.
- **Dynamic Bias Scoring:** Automatically calculates a variance score. A high score proves the model is inappropriately weighing demographic data over the facts of the crime.
- **Premium Glassmorphic UI:** Built with React, Vite, and Tailwind CSS v4, featuring a dark-mode "midnight glass" aesthetic to emphasize the gravity of the topic.
- **Persistent History:** Automatically logs simulations to Firebase Firestore, allowing users to browse past cases and observe broader trends in algorithmic bias.

## 🛠️ Technology Stack
- **Frontend:** React 19, Vite, Tailwind CSS v4
- **Backend:** Python 3.11, FastAPI, Uvicorn
- **AI Model:** Google Gemini 2.5 Flash
- **Database:** Firebase Firestore (Admin SDK)
- **Deployment:** Google Cloud Run (Backend), Vercel (Frontend)

## 💻 Local Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- A Google AI Studio API Key (`GEMINI_API_KEY`)

### 1. Start the Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt

# Add your Gemini API Key to the environment file
# .env -> GEMINI_API_KEY=your_key_here

# Run the server
uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend (React + Vite)
```bash
cd frontend
npm install

# Run the dev server
npm run dev
```

## 🏆 Google Solution Challenge 2026
This project was built for the **Google Solution Challenge 2026**, targeting the United Nations Sustainable Development Goal **#16: Peace, Justice and Strong Institutions**, specifically aiming to ensure equal access to justice for all and promote non-discriminatory laws and policies.
