import os
from openai import OpenAI
from .tools import get_weather
# from agent import run_agent

# OpenRouter client (OpenAI SDK compatible)
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
    default_headers={
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Weather Chat App",
    },
)

def extract_city(message: str) -> str:
    words = message.lower().replace("?", "").split()
    stop_words = {"weather", "in", "at", "of", "is", "the", "what"}
    filtered = [w for w in words if w not in stop_words]
    return filtered[-1] if filtered else ""

def run_agent(message: str) -> str:
    text = message.lower()

    # 🌦️ Weather path
    if "weather" in text:
        city = extract_city(message)
        return get_weather(city)

    # 🤖 LLM path (DIRECT OpenRouter call)
    try:
        response = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": message},
            ],
            temperature=0.3,
        )
        return response.choices[0].message.content
    except Exception as e:
        print("LLM ERROR:", e)
        return "⚠️ AI service is temporarily unavailable. Please try again later."
