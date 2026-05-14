"""API route handlers for the quiz generator."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime

from app.database import get_db
from app.schemas import (
    GenerateQuizRequest,
    QuizResponse,
    ArticleListResponse,
    ArticleListItem,
    HealthCheckResponse
)
from app.quiz_service import quiz_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/generate-quiz", response_model=QuizResponse, status_code=status.HTTP_200_OK)
async def generate_quiz(
    request: GenerateQuizRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a quiz from a Wikipedia article URL.
    
    Args:
        request: Quiz generation request with URL and optional num_questions
        db: Database session
        
    Returns:
        Complete quiz response with questions, entities, and related topics
        
    Raises:
        HTTPException: If URL is invalid or processing fails
    """
    try:
        num_questions = request.num_questions or 10
        quiz = await quiz_service.generate_quiz(request.url, num_questions, db)
        return quiz
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error generating quiz: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate quiz: {str(e)}"
        )


@router.get("/quizzes", response_model=ArticleListResponse)
async def get_quizzes(db: AsyncSession = Depends(get_db)):
    """
    Get list of all processed Wikipedia articles.
    
    Args:
        db: Database session
        
    Returns:
        List of articles with basic information
    """
    try:
        articles = await quiz_service.get_all_quizzes(db)
        return ArticleListResponse(
            articles=articles,
            total=len(articles)
        )
    except Exception as e:
        logger.error(f"Error fetching quizzes: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch quizzes: {str(e)}"
        )


@router.get("/quizzes/{article_id}", response_model=QuizResponse)
async def get_quiz_by_id(
    article_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get full quiz details by article ID.
    
    Args:
        article_id: ID of the article
        db: Database session
        
    Returns:
        Complete quiz response
        
    Raises:
        HTTPException: If quiz not found
    """
    try:
        quiz = await quiz_service.get_quiz_by_id(article_id, db)
        if not quiz:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Quiz with ID {article_id} not found"
            )
        return quiz
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching quiz: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch quiz: {str(e)}"
        )


@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """
    Health check endpoint.
    
    Returns:
        Health status of the API
    """
    return HealthCheckResponse(
        status="healthy",
        message="AI Wiki Quiz Generator API is running",
        timestamp=datetime.now()
    )
