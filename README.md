# 🌾 Kisan Mitra — AI Farmer Assistant

> An AI-powered assistant that helps Indian farmers discover government schemes, check eligibility, upload documents, and track applications — in **English** and **Kannada**.

---

## 📸 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Register / Login** | Phone-number based auth — no password needed |
| 🎯 **Eligibility Check** | Rule-based AI matches your profile to government schemes |
| 💬 **AI Chatbot** | Ask questions in English or Kannada |
| 🎤 **Voice Chat** | Speak your query; bot replies are read aloud (Chrome) |
| 📄 **Document Upload** | Aadhaar, Land Record, Bank Passbook, Electricity Bill |
| 📋 **My Applications** | Track all applied schemes and their statuses |
| ✏️ **Edit Profile** | Update your details anytime |
| 🔔 **Notifications** | Scheme deadlines and alerts |
| 🌐 **Multilingual** | English & Kannada support throughout |

---

## 🗂️ Project Structure

```
Farmers/
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── routes/           # API route handlers
│   │   │   ├── farmers.py    # Register, Login, Profile
│   │   │   ├── schemes.py    # Government schemes
│   │   │   ├── eligibility.py# Eligibility engine
│   │   │   ├── forms.py      # Form pre-fill & applications
│   │   │   ├── chat.py       # AI chatbot
│   │   │   └── notifications.py
│   │   ├── models.py         # SQLAlchemy DB models
│   │   ├── schemas.py        # Pydantic request/response schemas
│   │   ├── database.py       # DB connection (SQLite)
│   │   ├── config.py         # Environment settings
│   │   └── services/         # Business logic
│   ├── main.py               # FastAPI app entry point
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Environment variable template
│
├── frontend/                 # Vanilla HTML/CSS/JS frontend
│   ├── index.html            # Main SPA page
│   ├── app.js                # All frontend logic
│   └── style.css             # Premium dark UI styles
│
└── README.md
```

---

## ⚙️ Prerequisites

- **Python 3.10+** — [Download](https://www.python.org/downloads/)
- **Google Chrome** — for Voice Chat (Web Speech API)
- **Groq API Key** *(optional, for AI chatbot)* — [Get free key](https://console.groq.com)

---

## 🚀 Steps to Run the Project

### Step 1 — Clone / Open the Project

Open the `Farmers` folder in your terminal:

```powershell
cd "C:\Users\pavan\OneDrive\Desktop\Farmers"
```

---

### Step 2 — Set Up Environment Variables

```powershell
cd backend
copy .env.example .env
```

Open `.env` and set these two values:

```env
SECRET_KEY=any-random-string-at-least-32-characters-long
GROQ_API_KEY=your-groq-api-key-here
```

> 💡 **Generate a SECRET_KEY** — use any random string like:
> `Kx9mP2vQn7wRt4LsYcBdJhZeAuGf3NpX8`
>
> 💡 **Groq API Key** — sign up free at https://console.groq.com
> Without it, the chatbot returns a basic rule-based reply instead of AI.

---

### Step 3 — Create a Virtual Environment

```powershell
cd "C:\Users\pavan\OneDrive\Desktop\Farmers\backend"
python -m venv venv
.\venv\Scripts\Activate
```

You should see `(venv)` in your terminal prompt.

---

### Step 4 — Install Dependencies

```powershell
pip install -r requirements.txt
```

**Optional** — Install Groq for AI chatbot:
```powershell
pip install groq==0.8.0
```

---

### Step 5 — Start the Backend Server

```powershell
uvicorn main:app --reload
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

---

### Step 6 — Open the App

Open your browser and visit:

| What | URL |
|------|-----|
| 🌐 **App (Frontend)** | http://localhost:8000 |
| 📄 **API Docs (Swagger)** | http://localhost:8000/docs |
| ❤️ **Health Check** | http://localhost:8000/health |

---

### Step 7 — Seed Government Schemes (First Time Only)

After opening the app, run this once to load scheme data:

**Option A** — Via PowerShell:
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:8000/api/schemes/seed"
```

**Option B** — In the app, go to `http://localhost:8000/docs` → find `POST /api/schemes/seed` → click **Execute**.

> ✅ The app also seeds automatically on first registration.

---

## 🔄 Stopping the Server

Press `Ctrl + C` in the terminal where `uvicorn` is running.

---

## 📱 Using the App

### First Time — Register
1. Open http://localhost:8000
2. Click **🌱 Register Now**
3. Fill in your details (name, phone, state, land size, crop)
4. Upload documents: **Aadhaar, Land Record, Bank Passbook, Electricity Bill**
5. Click **Register & Find Schemes** → lands on Dashboard

### Returning User — Login
1. Click **🔑 Already registered? Login**
2. Enter your registered **phone number**
3. Click **Login** → lands on Dashboard

---

## 🔑 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/farmers/register` | Register a new farmer |
| `POST` | `/api/farmers/login` | Login with phone number |
| `GET` | `/api/farmers/{id}` | Get farmer profile |
| `PUT` | `/api/farmers/{id}` | Update farmer profile |
| `GET` | `/api/schemes/` | List all schemes |
| `POST` | `/api/schemes/seed` | Seed initial schemes |
| `GET` | `/api/eligibility/{farmer_id}` | Check scheme eligibility |
| `POST` | `/api/forms/prefill` | Pre-fill application form |
| `POST` | `/api/forms/confirm` | Confirm & save application |
| `GET` | `/api/forms/applications/{farmer_id}` | Get farmer's applications |
| `POST` | `/api/chat/` | AI chatbot message |
| `GET` | `/api/notifications/{farmer_id}` | Get notifications |

---

## 🛠️ Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` with venv active |
| Port 8000 already in use | Run `uvicorn main:app --reload --port 8001` |
| Voice chat not working | Use **Google Chrome** (not Firefox/Edge) |
| Chatbot gives basic reply | Add `GROQ_API_KEY` to `.env` and `pip install groq==0.8.0` |
| Phone already registered | Use the **Login** button instead of Register |
| Documents not saving | Browser localStorage must be enabled |

---

## ⚠️ Important Disclaimer

> This system **NEVER** automates OTP, CAPTCHA, or any government portal authentication.
> All final form submissions are completed **by the farmer** on the official government website.
> This tool only assists with scheme discovery, eligibility checking, and form pre-filling.

---

## 🧑‍💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | FastAPI (Python 3.10+) |
| **Database** | SQLite (via SQLAlchemy) |
| **AI / LLM** | Groq API (Llama 3 8B) |
| **Frontend** | Vanilla HTML + CSS + JavaScript |
| **Voice** | Web Speech API (browser built-in) |
| **Auth** | Phone-number lookup (no password) |

---

*Built with ❤️ for Indian farmers — Kisan Mitra v1.0*
