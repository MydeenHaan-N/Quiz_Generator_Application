"""
Pydantic schemas for request/response validation.
Defines data models for API endpoints.
"""
from pydantic import BaseModel, HttpUrl, Field
from typing import List, Optional, Dict
from datetime import datetime


# Entity Schemas
class KeyEntitySchema(BaseModel):
    """Schema for key entities."""
    entity_type: str
    entity_name: str
    
    class Config:
        from_attributes = True


class KeyEntitiesGrouped(BaseModel):
    """Schema for grouped entities by type."""
    people: List[str] = []
    organizations: List[str] = []
    locations: List[str] = []


# Question Schemas
class QuestionSchema(BaseModel):
    """Schema for quiz questions."""
    question: str
    options: List[str] = Field(..., min_length=4, max_length=4)
    answer: str
    difficulty: str = Field(..., pattern="^(easy|medium|hard)$")
    explanation: Optional[str] = None
    
    class Config:
        from_attributes = True


class QuestionResponse(BaseModel):
    """Schema for question response with ID."""
    id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str
    difficulty: str
    explanation: Optional[str] = None
    
    class Config:
        from_attributes = True


# Quiz Request/Response Schemas
class GenerateQuizRequest(BaseModel):
    """Request schema for quiz generation."""
    url: str = Field(..., description="Wikipedia article URL")
    num_questions: Optional[int] = Field(10, ge=1, le=20, description="Number of questions to generate")


class QuizResponse(BaseModel):
    """Complete quiz response schema."""
    id: int
    url: str
    title: str
    summary: Optional[str] = None
    key_entities: KeyEntitiesGrouped
    sections: Optional[List[str]] = None
    quiz: List[QuestionResponse]
    related_topics: List[str] = []
    created_at: datetime
    
    class Config:
        from_attributes = True


# Article Schemas
class ArticleListItem(BaseModel):
    """Schema for article list item in history."""
    id: int
    url: str
    title: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class ArticleListResponse(BaseModel):
    """Response schema for articles list."""
    articles: List[ArticleListItem]
    total: int


# Health Check
class HealthCheckResponse(BaseModel):
    """Health check response."""
    status: str
    message: str
    timestamp: datetime
