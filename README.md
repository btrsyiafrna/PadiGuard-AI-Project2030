# PadiGuard-AI-Project2030

PadiGuard AI is an agentic, culturally sovereign AI platform developed for Project 2030: MyAI Future Hackathon (Track 1: Padi & Plates) to address Malaysia’s RM78.8 billion annual food import dependency and the 25–40% yield losses faced by smallholder farmers. 

Built using the complete Google AI Ecosystem Stack, PadiGuard focuses on cultural alignment through "Sovereign RAG," ensuring predictions and recommendations adhere to trusted Malaysian agricultural standards.

---

## 🌟 Features

- **Multi-Agent Swarm Orchestration**: Independent specialized agents built with Genkit work synchronously.
- **Multimodal Disease Detection**: Analyzes photos of padi crops to diagnose diseases visually, assessing plant stages.
- **Predictive Outbreak Modeling**: Processes telemetry (temperature, humidity, location) to dynamically score the risk of agricultural outbreaks.
- **Sovereign RAG System**: Directly integrated with Google Cloud Vector Search to pull 100% verified Malaysian agricultural management protocols before the AI speaks.
- **Developer-Friendly Gateway**: Unified backend via Firebase Functions and NPM root proxies.

---

## 🏗️ Architectural Overview

The backend logic is centralized within an isolated Node.js/TypeScript functions directory powered by Firebase Genkit.

### 1. The Swarm Agents
- **Detection Agent (`detection_agent.ts`)**: Acts as a "Senior Rice Pathologist". Powered by Gemini 1.5 Flash Vision capabilities, it inspects uploaded crop images to identify physical symptoms and pests.
- **Prediction Agent (`prediction_agent.ts`)**: Acts as an "Agricultural Data Scientist". Ingests incoming weather telemetry and uses data-driven modeling to provide an outbreak Risk Score and pre-emptive actions in Bahasa Melayu.

### 2. The Grounding Engine (RAG)
To prevent the LLM from hallucinating Western agricultural advice, the Prediction Agent runs a **retriever tool** (`padiDiseaseRetrieverTool`) querying Google Cloud Discovery Engine (Vector Search) immediately before answering. It extracts relevant snippets from official PDFs and restricts Gemini to answering ONLY within localized recommendations.

### 3. Flow Exposure
Genkit `ai.defineFlow` endpoints (`diagnosePlantFlow` and `predictOutbreakFlow` inside `index.ts`) abstract complex multimodal and RAG pipelines into simple callable endpoints for connecting web/mobile frontends.

---

## 🚀 Setup Steps

### Prerequisites
1. **Node.js**: v20 or higher.
2. **Google Cloud / Firebase Project**: You must have a GCP project initialized.
3. **Google GenAI API Key**: For model execution.
4. **Google Cloud Vector Search**: A structured data store deployed.

### 1. Clone & Install
Clone the repository and install dependency paths.

```bash
git clone https://github.com/btrsyiafrna/PadiGuard-AI-Project2030.git
cd PadiGuard-AI-Project2030/functions
npm install
cd .. # Return to root
```

### 2. Configure Environment Variables
Inside the `functions` directory, create/update the `.env` file with your credentials:
```env
GOOGLE_GENAI_API_KEY=AIzaSy...Your_Key_Here
GCLOUD_PROJECT=your-gcp-project-id
DATA_STORE_ID=your-discovery-engine-data-store-id
GENKIT_ENV=dev
```

### 3. Application Authentication
Because the RAG Retriever utilizes `@google-cloud/discoveryengine`, you must authenticate your local terminal with Google Cloud IAM so it can hit the protected Vector Search arrays. Run:
```bash
gcloud auth application-default login
```

### 4. Running the Dev Server
Thanks to the unified `package.json` configurations at the root level, you can launch the Genkit Developer UI and flow server synchronously directly from the root!

```bash
npm start
```
*Behind the scenes, this proxies instantly into `functions/src/index.ts`!*

You can now navigate to `http://localhost:4000` to test the predictive flows and image analysis APIs visually!

---

## 🔌 Enabled Google Cloud APIs (Reference)
- Vertex AI & Genkit (Orchestration)
- Google Gen AI (Vision & Reasoning)
- Discovery Engine (Sovereign Vector Search)
- Speech-to-Text (Farmer Voice Interface) *[Planned]*
- Translation API (Dialect Processing) *[Planned]*
- Earth Engine (Satellite Prediction) *[Planned]*