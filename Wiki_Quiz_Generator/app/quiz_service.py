"""
Quiz service - Business logic orchestration.
Coordinates scraping, LLM processing, and database operations.
"""
import logging
from typing import Dict, List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import WikipediaArticle, Quiz, Question, KeyEntity, RelatedTopic
from app.scraper import scraper
from app.llm_service import llm_service
from app.schemas import QuizResponse, KeyEntitiesGrouped, QuestionResponse, ArticleListItem

logger = logging.getLogger(__name__)


class QuizService:
    """Service for quiz generation and management."""
    
    async def generate_quiz(
        self,
        url: str,
        num_questions: int,
        db: AsyncSession
    ) -> QuizResponse:
        """
        Main orchestration function for quiz generation.
        
        Args:
            url: Wikipedia article URL
            num_questions: Number of questions to generate
            db: Database session
            
        Returns:
            Complete quiz response
        """
        # 1. Check cache (if URL already processed)
        cached = await self._get_cached_quiz(url, db)
        if cached:
            logger.info(f"Returning cached quiz for URL: {url}")
            return cached
        
        # 2. Scrape article
        logger.info(f"Scraping article: {url}")
        article_data = scraper.scrape_article(url)
        
        # 3. Generate quiz using LLM
        logger.info("Generating quiz questions...")
        questions = llm_service.generate_quiz(
            article_data['full_text'],
            article_data['title'],
            num_questions
        )
        
        # 4. Generate related topics
        logger.info("Generating related topics...")
        related_topics = llm_service.generate_related_topics(
            article_data['full_text'],
            article_data['title']
        )
        
        # 5. Extract entities via LLM
        logger.info("Extracting entities...")
        llm_entities = llm_service.extract_entities_llm(
            article_data['full_text'],
            article_data['title']
        )
        
        # Merge basic and LLM entities
        merged_entities = self._merge_entities(
            article_data['key_entities'],
            llm_entities
        )
        
        # 6. Store in database
        logger.info("Storing data in database...")
        quiz_response = await self._store_quiz_data(
            article_data,
            questions,
            related_topics,
            merged_entities,
            db
        )
        
        logger.info(f"Quiz generation complete for: {article_data['title']}")
        return quiz_response
    
    async def get_all_quizzes(self, db: AsyncSession) -> List[ArticleListItem]:
        """
        Get list of all processed articles.
        
        Args:
            db: Database session
            
        Returns:
            List of article items
        """
        result = await db.execute(
            select(WikipediaArticle).order_by(WikipediaArticle.created_at.desc())
        )
        articles = result.scalars().all()
        
        return [
            ArticleListItem(
                id=article.id,
                url=article.url,
                title=article.title,
                created_at=article.created_at
            )
            for article in articles
        ]
    
    async def get_quiz_by_id(self, article_id: int, db: AsyncSession) -> Optional[QuizResponse]:
        """
        Get quiz by article ID.
        
        Args:
            article_id: Article ID
            db: Database session
            
        Returns:
            Quiz response or None
        """
        result = await db.execute(
            select(WikipediaArticle)
            .options(
                selectinload(WikipediaArticle.quizzes).selectinload(Quiz.questions),
                selectinload(WikipediaArticle.key_entities),
                selectinload(WikipediaArticle.related_topics)
            )
            .where(WikipediaArticle.id == article_id)
        )
        article = result.scalar_one_or_none()
        
        if not article or not article.quizzes:
            return None
        
        return self._build_quiz_response(article)
    
    async def _get_cached_quiz(self, url: str, db: AsyncSession) -> Optional[QuizResponse]:
        """Check if quiz exists for URL and return it."""
        result = await db.execute(
            select(WikipediaArticle)
            .options(
                selectinload(WikipediaArticle.quizzes).selectinload(Quiz.questions),
                selectinload(WikipediaArticle.key_entities),
                selectinload(WikipediaArticle.related_topics)
            )
            .where(WikipediaArticle.url == url)
        )
        article = result.scalar_one_or_none()
        
        if article and article.quizzes:
            return self._build_quiz_response(article)
        
        return None
    
    async def _store_quiz_data(
        self,
        article_data: Dict,
        questions: List[Dict],
        related_topics: List[str],
        entities: Dict[str, List[str]],
        db: AsyncSession
    ) -> QuizResponse:
        """Store all quiz data in database."""
        
        # Create article record
        article = WikipediaArticle(
            url=article_data['url'],
            title=article_data['title'],
            summary=article_data['summary'],
            sections=article_data['sections'],
            raw_html=article_data.get('raw_html')
        )
        db.add(article)
        await db.flush()  # Get article ID
        
        # Create quiz record
        quiz = Quiz(article_id=article.id)
        db.add(quiz)
        await db.flush()  # Get quiz ID
        
        # Create question records
        for q_data in questions:
            question = Question(
                quiz_id=quiz.id,
                question_text=q_data['question'],
                option_a=q_data['options'][0],
                option_b=q_data['options'][1],
                option_c=q_data['options'][2],
                option_d=q_data['options'][3],
                correct_answer=q_data['answer'],
                difficulty=q_data['difficulty'],
                explanation=q_data.get('explanation', '')
            )
            db.add(question)
        
        # Create entity records
        for entity_type in ['people', 'organizations', 'locations']:
            for entity_name in entities.get(entity_type, []):
                entity = KeyEntity(
                    article_id=article.id,
                    entity_type=entity_type,
                    entity_name=entity_name
                )
                db.add(entity)
        
        # Create related topic records
        for topic in related_topics:
            related = RelatedTopic(
                article_id=article.id,
                topic_name=topic
            )
            db.add(related)
        
        await db.commit()
        await db.refresh(article)
        
        # Reload with relationships
        result = await db.execute(
            select(WikipediaArticle)
            .options(
                selectinload(WikipediaArticle.quizzes).selectinload(Quiz.questions),
                selectinload(WikipediaArticle.key_entities),
                selectinload(WikipediaArticle.related_topics)
            )
            .where(WikipediaArticle.id == article.id)
        )
        article = result.scalar_one()
        
        return self._build_quiz_response(article)
    
    def _build_quiz_response(self, article: WikipediaArticle) -> QuizResponse:
        """Build quiz response from database models."""
        # Group entities by type
        entities_grouped = KeyEntitiesGrouped()
        for entity in article.key_entities:
            if entity.entity_type == 'people':
                entities_grouped.people.append(entity.entity_name)
            elif entity.entity_type == 'organizations':
                entities_grouped.organizations.append(entity.entity_name)
            elif entity.entity_type == 'locations':
                entities_grouped.locations.append(entity.entity_name)
        
        # Get latest quiz
        quiz = article.quizzes[0] if article.quizzes else None
        
        # Build question responses
        quiz_questions = []
        if quiz:
            for q in quiz.questions:
                quiz_questions.append(QuestionResponse(
                    id=q.id,
                    question_text=q.question_text,
                    option_a=q.option_a,
                    option_b=q.option_b,
                    option_c=q.option_c,
                    option_d=q.option_d,
                    correct_answer=q.correct_answer,
                    difficulty=q.difficulty,
                    explanation=q.explanation
                ))
        
        # Get related topics
        topics = [t.topic_name for t in article.related_topics]
        
        return QuizResponse(
            id=article.id,
            url=article.url,
            title=article.title,
            summary=article.summary,
            key_entities=entities_grouped,
            sections=article.sections,
            quiz=quiz_questions,
            related_topics=topics,
            created_at=article.created_at
        )
    
    def _merge_entities(
        self,
        basic_entities: Dict[str, List[str]],
        llm_entities: Dict[str, List[str]]
    ) -> Dict[str, List[str]]:
        """Merge entities from scraper and LLM, removing duplicates."""
        merged = {}
        for entity_type in ['people', 'organizations', 'locations']:
            combined = set()
            combined.update(basic_entities.get(entity_type, []))
            combined.update(llm_entities.get(entity_type, []))
            merged[entity_type] = list(combined)[:10]  # Limit to 10
        
        return merged


# Singleton instance
quiz_service = QuizService()
