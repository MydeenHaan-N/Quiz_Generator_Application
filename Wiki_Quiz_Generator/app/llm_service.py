"""
LLM integration service.
Supports Gemini and Groq providers for quiz generation tasks.
"""
import json
import logging
import re
from typing import List, Dict

import requests
import google.generativeai as genai

from app.config import settings

logger = logging.getLogger(__name__)


class LLMService:
    """Service for LLM-based content generation."""

    def __init__(self):
        self.provider = settings.llm_provider.lower()
        self.model_name = settings.groq_model

        self.model = None
        self.generation_config = None

        if self.provider == "gemini":
            if not settings.gemini_api_key:
                raise ValueError("GEMINI_API_KEY is required when LLM_PROVIDER=gemini")
            genai.configure(api_key=settings.gemini_api_key)
            self.model = genai.GenerativeModel("gemini-2.5-flash")
            self.generation_config = genai.GenerationConfig(
                temperature=0.3,
                top_p=0.95,
                top_k=40,
                max_output_tokens=8192,
            )
        elif self.provider == "groq":
            if not settings.groq_api_key:
                raise ValueError("GROQ_API_KEY is required when LLM_PROVIDER=groq")
        else:
            raise ValueError(f"Unsupported LLM_PROVIDER: {self.provider}")

    def _generate_content(self, prompt: str) -> str:
        """Generate raw text output from the configured provider."""
        if self.provider == "gemini":
            response = self.model.generate_content(
                prompt,
                generation_config=self.generation_config
            )
            return response.text

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.groq_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": self.model_name,
                "messages": [
                    {"role": "system", "content": "Return strict JSON only."},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.3,
            },
            timeout=60,
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]

    def generate_quiz(self, article_text: str, title: str, num_questions: int = 10) -> List[Dict]:
        max_chars = 20000
        if len(article_text) > max_chars:
            article_text = article_text[:max_chars] + "..."

        prompt = f"""You are an expert quiz generator. Based on the following Wikipedia article about "{title}",
generate exactly {num_questions} quiz questions.

ARTICLE CONTENT:
{article_text}

REQUIREMENTS:
1. Each question must be directly answerable from the article content
2. Do NOT include information not present in the article
3. Create diverse questions covering different sections
4. Ensure questions are clear and unambiguous
5. Questions should test understanding, not just memory

For each question, provide:
- question: The question text
- options: Exactly 4 options as an array
- answer: The correct option text (must match one of the options)
- difficulty: "easy", "medium", or "hard"
- explanation: Brief explanation (1-2 sentences)

Return ONLY a valid JSON array of question objects.
Each object must have: question, options, answer, difficulty, explanation."""

        try:
            result_text = self._generate_content(prompt)
            questions = self._parse_json_response(result_text)

            validated_questions = []
            for q in questions:
                if self._validate_question(q):
                    validated_questions.append(q)
                if len(validated_questions) >= num_questions:
                    break

            return validated_questions[:num_questions]
        except Exception as e:
            logger.error(f"Error generating quiz: {str(e)}")
            raise Exception(f"Failed to generate quiz: {str(e)}")

    def generate_related_topics(self, article_text: str, title: str) -> List[str]:
        summary = article_text[:3000] if len(article_text) > 3000 else article_text

        prompt = f"""Based on this Wikipedia article titled "{title}", suggest 5-7 related topics.

ARTICLE SUMMARY:
{summary}

Return ONLY a JSON array of concise topic strings."""

        try:
            result_text = self._generate_content(prompt)
            topics = self._parse_json_response(result_text)

            if isinstance(topics, list):
                topics = [str(t) for t in topics if isinstance(t, str)]
                return topics[:7]
            return []
        except Exception as e:
            logger.error(f"Error generating related topics: {str(e)}")
            return []

    def extract_entities_llm(self, article_text: str, title: str) -> Dict[str, List[str]]:
        text_sample = article_text[:5000] if len(article_text) > 5000 else article_text

        prompt = f"""Extract key entities from this Wikipedia article about "{title}".

ARTICLE TEXT:
{text_sample}

Return ONLY a JSON object with arrays:
{{
  "people": [],
  "organizations": [],
  "locations": []
}}
Maximum 10 entities per category."""

        try:
            result_text = self._generate_content(prompt)
            entities = self._parse_json_response(result_text)

            if isinstance(entities, dict):
                return {
                    "people": entities.get("people", [])[:10],
                    "organizations": entities.get("organizations", [])[:10],
                    "locations": entities.get("locations", [])[:10],
                }
            return {"people": [], "organizations": [], "locations": []}
        except Exception as e:
            logger.error(f"Error extracting entities: {str(e)}")
            return {"people": [], "organizations": [], "locations": []}

    def _parse_json_response(self, text: str):
        text = re.sub(r"```json\s*", "", text)
        text = re.sub(r"```\s*", "", text)
        text = text.strip()

        json_match = re.search(r"(\[.*\]|\{.*\})", text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
            try:
                return json.loads(json_str)
            except json.JSONDecodeError:
                json_str = json_str.replace("'", '"')
                return json.loads(json_str)

        raise ValueError("No valid JSON found in response")

    def _validate_question(self, question: Dict) -> bool:
        required_fields = ["question", "options", "answer", "difficulty"]
        if not all(field in question for field in required_fields):
            return False
        if not isinstance(question["options"], list) or len(question["options"]) != 4:
            return False
        if question["answer"] not in question["options"]:
            return False
        if question["difficulty"] not in ["easy", "medium", "hard"]:
            return False
        return True


llm_service = LLMService()
