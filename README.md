# AI Report and Content Generation Assistant

<div align="center">

![AI Report Generator](https://img.shields.io/badge/AI-Powered-6366f1?style=for-the-badge&logo=google&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?style=for-the-badge&logo=google)

**An AI-powered web application that generates professional reports, blogs, articles, emails, assignments, and more using Google Gemini API.**

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 AI Generation | Generate 7 content types using Google Gemini |
| 📚 Topic Dataset | 100+ pre-loaded topics across 11 CS/AI categories |
| 🎨 Tone Control | Professional, Academic, Formal, Friendly |
| 📏 Word Count | 300, 500, 1000, or custom |
| 👁️ Prompt Preview | See the exact prompt before generation |
| ✏️ Edit Mode | Edit generated content before exporting |
| 📄 PDF Export | Download as formatted PDF |
| 📝 DOCX Export | Download as Microsoft Word document |
| 📋 Copy | One-click clipboard copy |
| 🔄 Regenerate | Create another version with same settings |
| 📊 Stats | Word count + reading time after generation |
| 🕐 History | Save, search, and delete past generations |
| 🌙 Dark Mode | Full dark/light mode with system preference |
| 📱 Responsive | Works on desktop, tablet, and mobile |

---

## 🏗️ Project Structure

```
AI-Report-Generator/
├── client/                    # React Frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/     # Main app components
│   │   │   └── UI/            # Shared UI components
│   │   ├── context/           # React contexts (Theme)
│   │   ├── services/          # API service (Axios)
│   │   └── utils/             # Export helpers (PDF, DOCX)
│   └── package.json
│
├── server/                    # Flask Backend
│   ├── routes/                # API blueprints
│   ├── services/              # Gemini & MongoDB services
│   ├── prompts/               # Prompt engineering
│   ├── app.py                 # Flask entry point
│   └── requirements.txt
│
├── dataset/
│   └── topics.json            # 100+ topics
│
└── docs/
    ├── API.md
    └── INSTALLATION.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- MongoDB (local or Atlas)
- Google Gemini API key

### 1. Clone & Setup

```bash
# Backend
cd server
cp .env.example .env
# Edit .env with your GEMINI_API_KEY and MONGO_URI

pip install -r requirements.txt
python app.py

# Frontend (new terminal)
cd client
npm install
npm run dev
```

### 2. Open the app
Navigate to **http://localhost:5173**

---

## 🔑 Environment Variables

### Backend (`server/.env`)
```
GEMINI_API_KEY=your_key_here
MONGO_URI=mongodb://localhost:27017/ai_report_generator
FLASK_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```
# Leave empty in development (Vite proxy handles it)
VITE_API_URL=
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Backend health check |
| `POST` | `/generate` | Generate AI content |
| `POST` | `/preview` | Preview prompt only |
| `GET` | `/history` | Get generation history |
| `DELETE` | `/history/<id>` | Delete history item |
| `DELETE` | `/history` | Delete all history |

---

## 🚢 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

See `docs/INSTALLATION.md` for detailed deployment instructions.

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Axios, react-markdown, jsPDF, docx

**Backend:** Python Flask, Flask-CORS, python-dotenv, google-generativeai, pymongo

**Database:** MongoDB

**AI:** Google Gemini 1.5 Flash

---

## 📖 License

MIT License — Free for academic and commercial use.

---

<div align="center">
Built with ❤️ using Google Gemini AI
</div>
