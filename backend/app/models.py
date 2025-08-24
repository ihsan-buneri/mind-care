from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class AssessmentQuestion(BaseModel):
    id: int
    question: str
    answer: int
    answerText: str


class AssessmentData(BaseModel):
    score: int
    level: str
    answers: Dict[str, int]
    questions: List[AssessmentQuestion]


class ConversationMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    conversationHistory: Optional[List[ConversationMessage]] = []
    assessmentContext: Optional[str] = ""
    timestamp: Optional[str] = ""


class InitialContextRequest(BaseModel):
    assessmentContext: str
    timestamp: Optional[str] = ""


class Message(BaseModel):
    query: str


class Response(BaseModel):
    status: str
    data: str


class AssessmentResponse(BaseModel):
    status: str
    data: AssessmentData
