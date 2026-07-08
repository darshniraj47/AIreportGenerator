# Installation Guide

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | ≥ 18.0 | https://nodejs.org |
| Python | ≥ 3.10 | https://python.org |
| MongoDB | ≥ 6.0 | https://mongodb.com/try/download/community |
| Git | Any | https://git-scm.com |

---

## Step 1: Get a Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key — you'll need it in Step 3

---

## Step 2: Set Up MongoDB

**Option A — Local MongoDB:**
```bash
# Windows: Download and install from mongodb.com
# Then start the service:
net start MongoDB

# Your URI will be: mongodb://localhost:27017/ai_report_generator
```

**Option B — MongoDB Atlas (Free Cloud):**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Click **"Connect"** → **"Drivers"**
4. Copy the connection string (replace `<password>`)

---

## Step 3: Backend Setup

```bash
# Navigate to server directory
cd server

# Copy environment template
copy .env.example .env   # Windows
# cp .env.example .env   # Mac/Linux

# Edit .env file with your values:
# GEMINI_API_KEY=AIzaSy...your_key_here
# MONGO_URI=mongodb://localhost:27017/ai_report_generator

# Create a Python virtual environment
python -m venv venv

# Activate it:
venv\Scripts\activate    # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```

✅ Backend running at: **http://localhost:5000**
✅ Health check: **http://localhost:5000/health**

---

## Step 4: Frontend Setup

```bash
# Open a new terminal window
# Navigate to client directory
cd client

# Install dependencies
npm install

# Copy environment template (optional — only needed for production)
copy .env.example .env   # Windows

# Start the React dev server
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

---

## Step 5: Test the Application

1. Open **http://localhost:5173** in your browser
2. Select a topic from the dropdown or type a custom topic
3. Choose content type, tone, and word count
4. Click **Generate** — wait ~10-30 seconds for Gemini to respond
5. Download as PDF or DOCX

---

## Deployment to Production

### Frontend → Vercel

```bash
# Install Vercel CLI
npm install -g vercel

cd client
npm run build

# Deploy
vercel --prod
```

Set environment variable in Vercel dashboard:
```
VITE_API_URL = https://your-backend.onrender.com
```

### Backend → Render

1. Push your code to GitHub
2. Go to [Render](https://render.com) → New Web Service
3. Connect your GitHub repository
4. Set:
   - **Root Directory:** `server`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
5. Add Environment Variables:
   - `GEMINI_API_KEY` = your key
   - `MONGO_URI` = your Atlas URI
   - `FRONTEND_URL` = your Vercel URL

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `GEMINI_API_KEY missing` | Add key to `server/.env` |
| MongoDB connection failed | Check `MONGO_URI`, ensure MongoDB is running |
| CORS errors | Set `FRONTEND_URL` in `server/.env` to match your frontend URL |
| `npm install` fails | Delete `node_modules/` and retry |
| Port 5000 in use | Change port in `app.py`: `app.run(port=5001)` |
| Gemini quota exceeded | Wait or upgrade your API plan |
