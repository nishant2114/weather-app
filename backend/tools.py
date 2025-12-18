import os
import requests

def get_weather(city: str) -> str:
    api_key = os.getenv("WEATHER_API_KEY")
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

    r = requests.get(url)
    data = r.json()

    if r.status_code != 200:
        return "Could not fetch weather."

    temp = data["main"]["temp"]
    desc = data["weather"][0]["description"]

    # REMOVE special symbols like ° for safety
    return f"It is {temp} C in {city} with {desc}."
