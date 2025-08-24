# Import necessary libraries
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .agent.agent import chat_agent


from .models import (
    Message,
    Response,
    ChatRequest,
    AssessmentData,
    AssessmentResponse,
    InitialContextRequest,
)
from dotenv import load_dotenv


from agents import Runner


load_dotenv()


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Basic route
@app.get("/")
def read_root():
    return {"Message": "Hello World! FastAPI is working."}


# Assessment endpoint
@app.post("/assessment/", response_model=AssessmentResponse)
async def submit_assessment(assessment_data: AssessmentData):
    try:
        # Store assessment data (in a real app, you'd save to database)
        # For now, we'll just return the processed data
        return AssessmentResponse(status="success", data=assessment_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Initial context endpoint - provides AI response based on assessment
@app.post("/chat/initial-context/", response_model=Response)
async def get_initial_context(request: InitialContextRequest):
    if not request.assessmentContext.strip():
        raise HTTPException(
            status_code=400, detail="Assessment context cannot be empty"
        )

    try:
        # Create a context message for the AI to provide initial response
        context_message = f"""
Assessment Context:
{request.assessmentContext}

Based on this assessment data, provide a warm, welcoming initial message to the user. 
Acknowledge their assessment completion and offer personalized support based on their score and level.
Keep the response conversational and encouraging, but also appropriate for their mental health level.
"""

        result = await Runner.run(chat_agent, input=context_message)
        print(f"Initial context response: {result.final_output}")

        return Response(status="success", data=result.final_output)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Enhanced chat endpoint
@app.post("/chat/", response_model=Response)
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        # Prepare context for the agent
        context = ""

        # Add assessment context if available
        if request.assessmentContext:
            context += f"\n\nAssessment Context:\n{request.assessmentContext}"

        # Add conversation history if available
        if request.conversationHistory:
            context += "\n\nConversation History:\n"
            for msg in request.conversationHistory[-5:]:  # Last 5 messages for context
                context += f"{msg.role}: {msg.content}\n"

        # Combine context with user message
        full_message = f"{context}\n\nUser: {request.message}"

        result = await Runner.run(chat_agent, input=full_message)
        print(f"Agent response: {result.final_output}")

        return Response(status="success", data=result.final_output)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Legacy chat endpoint for backward compatibility
@app.post("/chat/legacy/", response_model=Response)
async def chat_legacy(message: Message):
    if not message.query.strip():
        raise HTTPException(status_code=400, detail="Message query cannot be empty")

    try:
        result = await Runner.run(chat_agent, input=message.query)
        print(f"Agent response: {result.final_output}")

        return Response(status="success", data=result.final_output)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
