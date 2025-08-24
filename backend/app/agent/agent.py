from .configuration import model
from .prompts.agent_instruction import instructions

from agents import Agent

chat_agent = Agent(
    name="MindCare Chatbot",
    instructions=instructions,
    model=model,
)
