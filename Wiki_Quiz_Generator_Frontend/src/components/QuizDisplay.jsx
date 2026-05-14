import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import QuestionCard from './QuestionCard';
import TakeQuizMode from './TakeQuizMode';
import { Book, Users, Building2, MapPin, Play, Eye } from 'lucide-react';

export default function QuizDisplay({ quizData }) {
  const { title, summary, key_entities, sections, quiz, related_topics } = quizData;
  const [quizMode, setQuizMode] = useState('view'); // 'view' or 'take'

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    hard: 'bg-red-100 text-red-800 border-red-200',
  };

  // If in "take quiz" mode, render TakeQuizMode component
  if (quizMode === 'take') {
    return (
      <div>
        <Button 
          onClick={() => setQuizMode('view')} 
          variant="outline" 
          className="mb-4 md:mb-6 h-10 md:h-12 px-4 md:px-6 rounded-xl border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Answers
        </Button>
        <TakeQuizMode quiz={quiz} title={title} />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Article Info */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">{title}</h1>
            {summary && (
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {summary}
              </p>
            )}
          </div>
          <Button 
            onClick={() => setQuizMode('take')} 
            className="btn-gradient h-11 md:h-12 px-5 md:px-6 rounded-xl font-semibold text-base w-full md:w-auto"
          >
            <Play className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Take Quiz
          </Button>
        </div>
      </div>

      {/* Key Entities */}
      {(key_entities.people?.length > 0 || 
        key_entities.organizations?.length > 0 || 
        key_entities.locations?.length > 0) && (
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Key Entities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {key_entities.people?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">People</h4>
                </div>
                <ul className="space-y-2">
                  {key_entities.people.map((person, idx) => (
                    <li key={idx} className="text-sm text-gray-600 pl-4 border-l-2 border-blue-200">{person}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {key_entities.organizations?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Organizations</h4>
                </div>
                <ul className="space-y-2">
                  {key_entities.organizations.map((org, idx) => (
                    <li key={idx} className="text-sm text-gray-600 pl-4 border-l-2 border-purple-200">{org}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {key_entities.locations?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Locations</h4>
                </div>
                <ul className="space-y-2">
                  {key_entities.locations.map((loc, idx) => (
                    <li key={idx} className="text-sm text-gray-600 pl-4 border-l-2 border-green-200">{loc}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sections */}
      {sections?.length > 0 && (
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Article Sections</h2>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {sections.map((section, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-xl text-sm font-medium hover:from-purple-200 hover:to-blue-200 transition-colors"
              >
                {section}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Questions */}
      <div className="space-y-4 md:space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold gradient-text">Quiz Questions</h2>
        {quiz && quiz.length > 0 ? (
          <div className="space-y-4 md:space-y-5">
            {quiz.map((question, idx) => (
              <QuestionCard
                key={question.id || idx}
                question={question}
                questionNumber={idx + 1}
                difficultyColors={difficultyColors}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No questions generated.</p>
        )}
      </div>

      {/* Related Topics */}
      {related_topics?.length > 0 && (
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl flex items-center justify-center">
              <Book className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Related Topics</h2>
          </div>
          <p className="text-gray-600 text-sm md:text-base mb-4">Explore these related topics to deepen your knowledge</p>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {related_topics.map((topic, idx) => (
              <a
                key={idx}
                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(topic.replace(/ /g, '_'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {topic}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
