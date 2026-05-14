# AI Wiki Quiz Generator - Frontend

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?style=flat&logo=React)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.0.4-646CFF.svg?style=flat&logo=Vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC.svg?style=flat&logo=Tailwind-CSS)](https://tailwindcss.com)

Modern React frontend for the AI Wiki Quiz Generator with a beautiful purple gradient UI inspired by Rise calendar.

---

## 🌟 Features

### Core Features
- ✅ **Quiz Generation**: Generate AI-powered quizzes from Wikipedia URLs
- ✅ **Quiz History**: View all past quizzes in table or grid view
- ✅ **Take Quiz Mode**: Interactive quiz-taking with scoring
- ✅ **Random Quiz**: Try pre-selected interesting topics
- ✅ **Responsive Design**: Mobile, tablet, and desktop optimized

### UI/UX Features
- 🎨 **Purple Gradient Theme**: Modern Rise calendar-inspired design
- 🌈 **Glass Morphism**: Backdrop blur effects
- 🎯 **Difficulty Badges**: Color-coded (Easy/Medium/Hard)
- 📊 **Dual View Modes**: Table and grid layouts
- 🔄 **Sorting**: Newest/Oldest quiz ordering
- ⚡ **Loading States**: Smooth transitions and feedback

---

## 🏗️ Architecture

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── tabs.jsx
│   │   │   ├── dialog.jsx
│   │   │   └── label.jsx
│   │   ├── QuizGenerator.jsx     # Main quiz generation form
│   │   ├── QuizDisplay.jsx       # Quiz results display
│   │   ├── QuizHistory.jsx       # Past quizzes table/grid
│   │   ├── TakeQuizMode.jsx      # Interactive quiz mode
│   │   ├── QuestionCard.jsx      # Individual question card
│   │   └── DetailsModal.jsx      # Quiz details modal
│   ├── services/
│   │   └── api.js                # Axios API client
│   ├── lib/
│   │   └── utils.js              # Utility functions
│   ├── App.jsx                   # Main application
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── screenshots/                   # Application screenshots
├── sample_data/                   # Sample API responses
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json                   # Vercel deployment config
├── .env.example                  # Environment variables template
├── .gitignore
└── README.md                     # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.x or higher
- **npm** or **yarn**
- **Backend API**: Running on http://localhost:8000 (or deployed)

### 1. Install Dependencies

```bash
cd frontend
npm install --legacy-peer-deps
```

**Note:** `--legacy-peer-deps` is required due to React 18.3.1 compatibility with lucide-react.

### 2. Configure Environment

Create `.env` file in `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000/api
```

For production, use your deployed backend URL:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

### 3. Run Development Server

```bash
npm run dev
```

Frontend will be available at: **http://localhost:5173**

### 4. Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary Purple */
--primary: hsl(262, 83%, 58%)

/* Gradients */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* Background */
from-purple-50 via-white to-blue-50

/* Glass Morphism */
bg-white/80 backdrop-blur-sm
```

### Component Styling

- **Cards**: `rounded-2xl` with `shadow-lg`
- **Buttons**: Gradient backgrounds with hover effects
- **Typography**: Bold headings with gradient text
- **Spacing**: Consistent padding and margins
- **Shadows**: Soft, layered shadows

### Responsive Breakpoints

```css
/* Mobile */
< 640px

/* Tablet */
640px - 1024px

/* Desktop */
> 1024px
```

---

## 📦 Dependencies

### Core
- **react**: ^18.3.1
- **react-dom**: ^18.3.1
- **vite**: ^7.1.7

### UI Components
- **@radix-ui/react-dialog**: ^1.0.5
- **@radix-ui/react-tabs**: ^1.0.4
- **@radix-ui/react-label**: ^2.0.2
- **@radix-ui/react-slot**: ^1.0.2
- **lucide-react**: ^0.321.0

### Styling
- **tailwindcss**: ^3.4.1
- **tailwindcss-animate**: ^1.0.7
- **clsx**: ^2.1.0
- **tailwind-merge**: ^2.2.1

### HTTP Client
- **axios**: ^1.6.7

---

## 🎯 Component Overview

### QuizGenerator.jsx
- Main quiz generation form
- URL validation
- Loading states
- Error handling
- Supports `initialUrl` prop for random quiz

### QuizHistory.jsx
- Table and grid view modes
- Newest/Oldest sorting
- "Take Quiz" button integration
- Responsive grid layout (1/2/3 columns)

### TakeQuizMode.jsx
- Interactive quiz-taking
- Answer selection
- Score calculation
- Results display with stats
- Retake functionality

### QuizDisplay.jsx
- Quiz results display
- Article summary
- Key entities (people, organizations, locations)
- Related topics
- Questions with explanations

### QuestionCard.jsx
- Individual question display
- Difficulty badge
- Four options (A-D)
- Gradient styling

### DetailsModal.jsx
- Modal for quiz details
- Full quiz information
- Responsive design

---

## 🚀 Deployment

### Vercel (Recommended) ⭐

**Status:** ✅ Perfect for React + Vite

**Deploy:**
```bash
vercel --prod
```

**Or connect GitHub repo for automatic deployments!**

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install --legacy-peer-deps`

**Environment Variables:**
```
VITE_API_URL=https://your-backend.railway.app/api
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Cloudflare Pages

```bash
npm run build
# Upload dist/ folder
```

---

## 🔧 Configuration Files

### vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### tailwind.config.js
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(262, 83%, 58%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Quiz generation works with valid Wikipedia URL
- [ ] Loading states display correctly
- [ ] Error messages show for invalid URLs
- [ ] Quiz history loads all past quizzes
- [ ] Table/Grid view toggle works
- [ ] Sorting (newest/oldest) functions
- [ ] Take Quiz mode opens and works
- [ ] Score calculation is accurate
- [ ] Responsive design on mobile/tablet/desktop
- [ ] "Try Random Quiz" button works

### Sample URLs for Testing

```
https://en.wikipedia.org/wiki/Artificial_intelligence
https://en.wikipedia.org/wiki/Python_(programming_language)
https://en.wikipedia.org/wiki/Albert_Einstein
https://en.wikipedia.org/wiki/Climate_change
https://en.wikipedia.org/wiki/Mount_Everest
```

---

## 🔧 Troubleshooting

### Issue: API Connection Failed

**Check:**
1. Backend is running on http://localhost:8000
2. `VITE_API_URL` is set correctly in `.env`
3. CORS is configured in backend

### Issue: Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Issue: Styling Not Loading

```bash
# Rebuild Tailwind
npx tailwindcss -i ./src/index.css -o ./dist/output.css
```

### Issue: React Peer Dependency Warning

**Solution:** Use `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
```

---

## 📱 Features by Tab

### Tab 1: Generate Quiz
1. Enter Wikipedia URL
2. Click "Generate Quiz"
3. Wait 10-30 seconds (LLM processing)
4. View generated quiz with:
   - Article summary
   - Key entities
   - 10 questions with explanations
   - Related topics

### Tab 2: Past Quizzes
1. View all generated quizzes
2. Toggle table/grid view
3. Sort by newest/oldest
4. Click "Details" to see full quiz
5. Click "Take Quiz" for interactive mode

---

## 🎨 UI Screenshots Location

Screenshots are stored in `frontend/screenshots/`:
- Main interface
- Quiz generation
- Quiz history (table view)
- Quiz history (grid view)
- Take quiz mode
- Mobile responsive views

---

## 📄 License

This project is created for educational purposes.

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 🔗 Related Files

- **Backend README**: `../backend/README.md`
- **Main README**: `../README.md`
- **Deployment Guide**: `../DEPLOYMENT.md`
- **Deployment Checklist**: `../DEPLOYMENT_CHECKLIST.md`

---

**Built with ❤️ using React, Vite, and Tailwind CSS**

*Last Updated: November 7, 2025*

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
