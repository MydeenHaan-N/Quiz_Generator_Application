"""
SQLAlchemy ORM models for the AI Wiki Quiz Generator.
Defines database schema for Wikipedia articles, quizzes, questions, entities, and related topics.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class WikipediaArticle(Base):
    """Model for storing Wikipedia article information."""
    
    __tablename__ = "wikipedia_articles"
    
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(500), unique=True, nullable=False, index=True)
    title = Column(String(500), nullable=False)
    summary = Column(Text, nullable=True)
    sections = Column(JSON, nullable=True)  # List of section titles
    raw_html = Column(Text, nullable=True)  # Optional: store raw HTML
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    quizzes = relationship("Quiz", back_populates="article", cascade="all, delete-orphan")
    key_entities = relationship("KeyEntity", back_populates="article", cascade="all, delete-orphan")
    related_topics = relationship("RelatedTopic", back_populates="article", cascade="all, delete-orphan")


class KeyEntity(Base):
    """Model for storing extracted key entities from articles."""
    
    __tablename__ = "key_entities"
    
    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("wikipedia_articles.id", ondelete="CASCADE"), nullable=False)
    entity_type = Column(String(50), nullable=False)  # 'people', 'organizations', 'locations'
    entity_name = Column(String(200), nullable=False)
    
    # Relationship
    article = relationship("WikipediaArticle", back_populates="key_entities")


class Quiz(Base):
    """Model for storing quiz metadata."""
    
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("wikipedia_articles.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    article = relationship("WikipediaArticle", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")


class Question(Base):
    """Model for storing individual quiz questions."""
    
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    option_a = Column(String(500), nullable=False)
    option_b = Column(String(500), nullable=False)
    option_c = Column(String(500), nullable=False)
    option_d = Column(String(500), nullable=False)
    correct_answer = Column(String(500), nullable=False)
    difficulty = Column(String(20), nullable=False)  # 'easy', 'medium', 'hard'
    explanation = Column(Text, nullable=True)
    
    # Relationship
    quiz = relationship("Quiz", back_populates="questions")


class RelatedTopic(Base):
    """Model for storing related topics for further reading."""
    
    __tablename__ = "related_topics"
    
    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("wikipedia_articles.id", ondelete="CASCADE"), nullable=False)
    topic_name = Column(String(200), nullable=False)
    
    # Relationship
    article = relationship("WikipediaArticle", back_populates="related_topics")
