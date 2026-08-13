# AI Tech Scout

> An AI-powered research and prototyping assistant that turns technical questions into structured, actionable engineering intelligence.

**AI Tech Scout** helps developers explore technologies, compare tools, understand trade-offs, evaluate recommendations, and turn research into practical technical decisions.

## 🚀 Live Demo

**Live Application:** ai-tech-scout.vercel.app

**GitHub:** github.com/ruchishya21-bot/ai-tech-scout

---

## ✨ Features

### 🔎 AI-Powered Research

Enter a technical topic and let AI generate a structured research result instead of manually searching through dozens of sources.

### 🧠 Intelligent Analysis

Research results are organized into useful engineering insights including:

* Executive summary
* Key findings
* Advantages and disadvantages
* Technical considerations
* Recommendations
* Practical implementation direction

### 📚 Research Archive

Every completed research session can be stored and accessed later through the research archive.

### 🗂️ Research History

Browse previous research sessions through a dedicated history interface.

### 📄 Detailed Research View

Open an individual research session and review its complete result.

### 🗑️ Research Management

Remove outdated research sessions through a confirmation flow.

### ⚡ Modern AI Interface

The frontend provides:

* Dark AI-focused design
* Responsive layouts
* Animated research states
* Loading indicators
* Toast notifications
* Error handling
* Mobile navigation
* Reduced-motion support

### 📱 Responsive

The interface is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

---

## 🏗️ Architecture

AI Tech Scout follows a frontend/backend architecture:

```text
                    ┌──────────────────────────┐
                    │          User            │
                    │    Research Question     │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     React Frontend       │
                    │          Vite            │
                    └────────────┬─────────────┘
                                 │
                              REST API
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     Node.js Backend      │
                    │      TypeScript          │
                    │        Express           │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
          ┌──────────────────┐      ┌──────────────────┐
          │    PostgreSQL    │      │    Gemini API    │
          │     Database     │      │   AI Research    │
          └──────────────────┘      └──────────────────┘
```

---

## 🧠 Research Flow

The core application flow is:

```text
User enters topic
       ↓
Frontend sends research request
       ↓
Express API receives request
       ↓
Research controller processes request
       ↓
Gemini AI generates research intelligence
       ↓
Result is structured
       ↓
Research result saved to PostgreSQL
       ↓
API returns result
       ↓
React displays research intelligence
       ↓
Research becomes available in Archive
```

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS
* Lucide Icons

### Backend

* Node.js
* TypeScript
* Express.js
* REST API

### Database

* PostgreSQL

### AI

* Google Gemini API

### Development Tools

* VS Code
* Git
* GitHub
* npm
* PowerShell

### Deployment

* Vercel
* PostgreSQL hosting
* Google Gemini API

---

## 📁 Project Structure

```text
ai-tech-scout/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── researchController.ts
│   │   │
│   │   ├── services/
│   │   │   └── geminiService.ts
│   │   │
│   │   ├── routes/
│   │   ├── db/
│   │   └── server.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── README.md
└── .gitignore
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ruchishya21-bot/ai-tech-scout.git
cd ai-tech-scout
```

---

## 🔧 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Start the development server:

```bash
npm run dev
```

The backend should run on:

```text
http://localhost:5000
```

---

## 🎨 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Vite will provide the local development URL.

---

## 🚀 Deployment

The application is deployed using a production frontend/backend setup with:

* Vercel for deployment
* PostgreSQL for persistent research data
* Google Gemini API for AI-powered research

Environment variables must be configured in the deployment environment.

---

## 🔐 Environment Variables

The following environment variables are required by the backend:

| Variable         | Description                  |
| ---------------- | ---------------------------- |
| `PORT`           | Backend server port          |
| `DATABASE_URL`   | PostgreSQL connection string |
| `GEMINI_API_KEY` | Google Gemini API key        |

Never commit real API keys, database passwords, or other secrets to GitHub.

---

## 📌 Future Improvements

Possible future improvements include:

* User authentication
* Saved user-specific research
* Research sharing
* Export research as PDF
* Advanced source tracking
* More AI research agents
* Technology recommendation scoring
* Research comparison
* Custom domains
* Usage analytics

---

## 👨‍💻 Author

**Ruchishya**

B.Tech Graduate | Java Full Stack Developer | AI Full Stack Developer

Interested in:

* Java
* Spring Boot
* React
* TypeScript
* AI Engineering
* Generative AI
* Full-Stack Development

---

## ⭐ Project

AI Tech Scout is built as a practical full-stack AI engineering project demonstrating:

**React + TypeScript + Node.js + Express + PostgreSQL + Gemini API**

The goal is to turn an ordinary technical research question into structured engineering intelligence through an AI-powered application.
