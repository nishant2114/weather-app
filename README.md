# 🌤️ Weather Chat App (LLM + FastAPI + React)

A minimal full-stack web application that allows users to ask for the weather of any city using natural language.

## 🚀 Features
- Ask weather using plain English
- LLM powered backend (LangChain + OpenRouter)
- Real-time weather via OpenWeatherMap API
- FastAPI backend
- Interactive React frontend
- Clear chat functionality

## 🏗️ Tech Stack

**Frontend**
- React
- JavaScript
- CSS

**Backend**
- FastAPI
- LangChain
- OpenRouter
- OpenWeatherMap API
- Python

## 📂 Project Structure

weather-app/
├── backend/
│ ├── main.py
│ ├── agent.py
│ ├── tools.py
│ └── requirements.py
├── frontend/
│ └── src/
│ ├── App.js
│ └── App.css
└── README.md



## 🔄 How It Works
1. User enters a weather query
2. Frontend sends request to backend
3. LangChain agent calls weather tool
4. Backend returns weather response
5. Frontend displays it in chat format

## ⚙️ Environment Variables

Create `backend/.env`:

OPEN_API_KEY=your_openrouter_key
WEATHER_API_KEY=your_openweather_key

## ▶️ Run Backend

cd backend
pip install -r requirements.py
python -m uvicorn main:app --reload


## ▶️ Run Frontend

cd frontend
npm install
npm start

## 👤 Author
Nishant Nilkanth Wankhede - 22211394
SanchAI Analytics Internship Assessment