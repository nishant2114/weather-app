import os
from langchain_openai import ChatOpenAI
from langchain.agents import initialize_agent, Tool
from backend.tools import get_weather

llm = ChatOpenAI(
    openai_api_key=os.getenv("OPENAI_API_KEY"),  # ✅ FIXED
    openai_api_base="https://openrouter.ai/api/v1",
    model="gpt-3.5-turbo",
)

tools = [
    Tool(
        name="Weather",
        func=get_weather,
        description="Get weather for a city"
    )
]

agent_executor = initialize_agent(
    tools=tools,
    llm=llm,
    agent="zero-shot-react-description",
    verbose=True
)
