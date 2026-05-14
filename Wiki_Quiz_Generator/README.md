# AI Wiki Quiz Generator - Backend API

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688.svg?style=flat&logo=FastAPI)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB.svg?style=flat&logo=Python)](https://www.python.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-316192.svg?style=flat&logo=PostgreSQL)](https://neon.tech)

FastAPI backend service that generates AI-powered quizzes from Wikipedia articles using Google Gemini AI.

---

## 🌟 Features

- ✅ **Wikipedia Scraping**: Extract content from any Wikipedia article
- ✅ **LLM Integration**: Google Gemini AI for intelligent question generation
- ✅ **Entity Extraction**: Identify people, organizations, and locations
- ✅ **Related Topics**: AI-suggested topics for further exploration
- ✅ **Quiz Caching**: Prevent duplicate processing of same URLs
- ✅ **RESTful API**: FastAPI with automatic OpenAPI documentation
- ✅ **Async Database**: PostgreSQL with asyncpg for high performance
- ✅ **Health Checks**: Built-in monitoring endpoints

---

## 🏗️ Architecture

```
backend/
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py          # API endpoints
│   ├── __init__.py
│   ├── main.py                # FastAPI application
│   ├── config.py              # Settings & configuration
│   ├── database.py            # Database connection & setup
│   ├── models.py              # SQLAlchemy ORM models
│   ├── schemas.py             # Pydantic request/response schemas
│   ├── scraper.py             # Wikipedia scraping logic
│   ├── llm_service.py         # Google Gemini integration
│   └── quiz_service.py        # Business logic orchestration
├── tests/
├── Dockerfile                 # Docker container configuration
├── .dockerignore             # Docker build exclusions
├── requirements.txt          # Python dependencies
├── .env.example              # Environment variables template
├── .gitignore
└── README.md                 # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Python**: 3.13 or higher
- **PostgreSQL**: Neon account (free tier available)
- **Google Gemini API Key**: Free tier from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 1. Clone & Navigate

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows CMD
venv\Scripts\activate.bat

# macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create `.env` file in the `backend/` directory:

```env
# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgresql+asyncpg://user:password@ep-xxx.neon.tech/dbname?sslmode=require

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Application Settings
DEBUG=True
APP_NAME=AI Wiki Quiz Generator
API_HOST=0.0.0.0
API_PORT=8000

# CORS Origins (comma-separated)
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]

# Quiz Settings
DEFAULT_NUM_QUESTIONS=10
MAX_NUM_QUESTIONS=20
```

**Get Credentials:**
- **Neon Database**: Sign up at [neon.tech](https://neon.tech) → Create project → Copy connection string
- **Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)

### 5. Initialize Database

Database tables will be created automatically on first run.

### 6. Run Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Server URLs:**
- API Root: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc
- Health Check: http://localhost:8000/api/health

---

## 📖 API Documentation

### Endpoints

#### 1. **POST** `/api/generate-quiz`

Generate a quiz from a Wikipedia URL.

**Request Body:**
```json
{
  "url": "https://en.wikipedia.org/wiki/Artificial_intelligence",
  "num_questions": 10
}
```

**Response:**
```json
{
  "id": 1,
  "url": "https://en.wikipedia.org/wiki/Artificial_intelligence",
  "title": "Artificial Intelligence",
  "summary": "Artificial intelligence (AI) is intelligence demonstrated...",
  "key_entities": {
    "people": ["Alan Turing", "John McCarthy"],
    "organizations": ["MIT", "Stanford University"],
    "locations": ["United States", "United Kingdom"]
  },
  "sections": ["History", "Applications", "Ethics"],
  "quiz": [
    {
      "id": 1,
      "question_text": "Who coined the term 'artificial intelligence'?",
      "option_a": "Alan Turing",
      "option_b": "John McCarthy",
      "option_c": "Marvin Minsky",
      "option_d": "Claude Shannon",
      "correct_answer": "John McCarthy",
      "difficulty": "medium",
      "explanation": "John McCarthy coined the term in 1956."
    }
  ],
  "related_topics": ["Machine Learning", "Neural Networks"],
  "created_at": "2025-11-07T10:30:00Z"
}
```

#### 2. **GET** `/api/quizzes`

Get all previously generated quizzes.

**Response:**
```json
{
  "articles": [
    {
      "id": 1,
      "url": "https://en.wikipedia.org/wiki/Artificial_intelligence",
      "title": "Artificial Intelligence",
      "created_at": "2025-11-07T10:30:00Z"
    }
  ],
  "total": 1
}
```

#### 3. **GET** `/api/quizzes/{quiz_id}`

Get full quiz details by ID.

**Response:** Same structure as `/api/generate-quiz`

#### 4. **GET** `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

---

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | 0.115.0 | Modern async Python web framework |
| **SQLAlchemy** | 2.0.35 | Async ORM for database operations |
| **asyncpg** | 0.30.0 | PostgreSQL async driver |
| **BeautifulSoup4** | 4.12.0 | HTML parsing and web scraping |
| **Google Generative AI** | 0.8.0 | Gemini AI integration |
| **Pydantic** | 2.9.0 | Data validation |
| **Uvicorn** | 0.32.0 | ASGI server |

---

## 📊 Database Schema

### Tables

**1. WikipediaArticle**
- `id` - Primary key
- `url` - Wikipedia article URL (unique)
- `title` - Article title
- `summary` - Article summary
- `sections` - JSON array of section names
- `created_at` - Timestamp

**2. Quiz**
- `id` - Primary key
- `article_id` - Foreign key to WikipediaArticle
- `created_at` - Timestamp

**3. Question**
- `id` - Primary key
- `quiz_id` - Foreign key to Quiz
- `question_text` - Question content
- `option_a`, `option_b`, `option_c`, `option_d` - Answer options
- `correct_answer` - Correct option
- `difficulty` - easy/medium/hard
- `explanation` - Answer explanation

**4. KeyEntity**
- `id` - Primary key
- `article_id` - Foreign key to WikipediaArticle
- `entity_type` - people/organizations/locations
- `entity_name` - Entity name

**5. RelatedTopic**
- `id` - Primary key
- `article_id` - Foreign key to WikipediaArticle
- `topic_name` - Related topic name

---

## 🧪 Testing

### Test Sample URLs

```bash
# Via curl
curl -X POST http://localhost:8000/api/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"url": "https://en.wikipedia.org/wiki/Python_(programming_language)", "num_questions": 10}'

# Via Python
import requests

response = requests.post(
    "http://localhost:8000/api/generate-quiz",
    json={
        "url": "https://en.wikipedia.org/wiki/Albert_Einstein",
        "num_questions": 10
    }
)
print(response.json())
```

### Sample Wikipedia URLs

```
https://en.wikipedia.org/wiki/Artificial_intelligence
https://en.wikipedia.org/wiki/World_War_II
https://en.wikipedia.org/wiki/Albert_Einstein
https://en.wikipedia.org/wiki/Python_(programming_language)
https://en.wikipedia.org/wiki/Mount_Everest
https://en.wikipedia.org/wiki/Climate_change
```

---

## 🚀 Deployment

### Google Cloud Run (Production) ✅

**Status:** Currently Deployed and Running

**Live Backend URL:** `https://ai-wiki-quiz-backend-87126578728.us-central1.run.app`

**Why Cloud Run?**
- ✅ No timeout limits (supports 30-second quiz generation)
- ✅ Auto-scaling from 0 to many instances
- ✅ Pay-per-use pricing (free tier: 2M requests/month)
- ✅ Perfect for FastAPI + LLM operations
- ✅ Containerized deployment with Docker

### Quick Deployment

```powershell
# 1. Set your project
gcloud config set project mulit-gen

# 2. Enable required APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com

# 3. Deploy from backend directory
cd backend
gcloud run deploy ai-wiki-quiz-backend \
  --source . \
  --region us-central1 \
  --platform managed \
  --project mulit-gen \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=your_database_url" \
  --set-env-vars "GEMINI_API_KEY=your_api_key" \
  --timeout=300 \
  --memory=1Gi
```

### Environment Variables for Production

Set these in Cloud Run:

```bash
DATABASE_URL=postgresql+asyncpg://user:pass@host/db?sslmode=require
GEMINI_API_KEY=your_gemini_api_key
DEBUG=False
APP_NAME=AI Wiki Quiz Generator
API_HOST=0.0.0.0
API_PORT=8080
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGINS=["https://your-frontend.vercel.app"]
DEFAULT_NUM_QUESTIONS=10
MAX_NUM_QUESTIONS=20
```

### Redeployment (After Code Changes)

```powershell
cd backend
gcloud run deploy ai-wiki-quiz-backend \
  --source . \
  --region us-central1 \
  --project mulit-gen
```

### View Logs

```powershell
# View recent logs
gcloud run services logs read ai-wiki-quiz-backend \
  --region us-central1 \
  --project mulit-gen \
  --limit=50

# Follow logs in real-time
gcloud run services logs tail ai-wiki-quiz-backend \
  --region us-central1 \
  --project mulit-gen
```

### Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| **Timeout** | 300s (5 min) | Quiz generation takes ~30s |
| **Memory** | 1Gi | Sufficient for FastAPI + LLM |
| **CPU** | 1 core | Adequate for workload |
| **Min Instances** | 0 | Scale to zero (save costs) |
| **Max Instances** | 10 | Handle traffic spikes |
| **Region** | us-central1 | Close to Neon database |

### Cost Estimate

**Free Tier:**
- 2 million requests/month
- 360,000 GB-seconds
- 180,000 vCPU-seconds

**Your Usage (~1000 quizzes/month):**
- Processing: 30s @ 1GB = 30,000 GB-seconds
- **Expected Cost: $0** (well within free tier!)

---

## 📚 Deployment Guides

- **Quick Commands**: See `../DEPLOY_COMMANDS.md`
- **Complete Guide**: See `../CLOUD_RUN_DEPLOYMENT.md`
- **Docker**: `Dockerfile` and `.dockerignore` included
- **Live URL**: `https://ai-wiki-quiz-backend-87126578728.us-central1.run.app`

---

## 🔧 Troubleshooting

### Database Connection Issues

```bash
# Check connection string format
DATABASE_URL=postgresql+asyncpg://user:pass@host/db?sslmode=require

# Verify SSL mode for Neon
?sslmode=require
```

### Gemini API Errors

```bash
# Verify API key
echo $GEMINI_API_KEY

# Check quota
# Visit: https://console.cloud.google.com/apis/dashboard
```

### Import Errors

```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +
```

### CORS Errors

Update `app/config.py`:
```python
cors_origins: List[str] = [
    "http://localhost:5173",
    "https://your-frontend.vercel.app"
]
```

---

## 📝 Development Notes

### Why No LangChain?

Initially planned, but removed due to:
- Python 3.13 compatibility issues
- `numpy` dependency required Rust compiler
- Direct Google Generative AI SDK is simpler

### Design Decisions

- **Neon PostgreSQL**: Serverless, auto-scaling, free tier
- **Async Everything**: FastAPI + asyncpg for maximum performance
- **Direct Gemini SDK**: Faster, fewer dependencies than LangChain
- **Caching**: Prevent duplicate scraping/generation

---

## 📄 License

This project is created for educational purposes.

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📧 Support

For issues or questions:
- Open an issue in the repository
- Check `DEPLOYMENT.md` for deployment help
- See interactive docs at `/docs` endpoint

---

**Built with ❤️ using FastAPI and Google Gemini AI**

*Last Updated: November 7, 2025*
