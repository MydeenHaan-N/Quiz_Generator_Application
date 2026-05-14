import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

export default function TakeQuizMode({ quiz, title }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (questionId, answer) => {
    if (showResults) return; // Prevent changing answers after submission
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    quiz.forEach(question => {
      if (userAnswers[question.id] === question.correct_answer) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setShowResults(true);

    // Scroll to results
    setTimeout(() => {
      document.getElementById('quiz-results')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getAnsweredCount = () => {
    return Object.keys(userAnswers).length;
  };

  const getOptionClass = (question, option) => {
    if (!showResults) {
      return userAnswers[question.id] === option
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 hover:border-gray-300';
    }

    // Show results
    const isCorrect = option === question.correct_answer;
    const isSelected = userAnswers[question.id] === option;

    if (isCorrect) {
      return 'border-green-500 bg-green-50';
    }
    
    if (isSelected && !isCorrect) {
      return 'border-red-500 bg-red-50';
    }

    return 'border-gray-200 opacity-60';
  };

  const getOptionIcon = (question, option) => {
    if (!showResults) return null;

    const isCorrect = option === question.correct_answer;
    const isSelected = userAnswers[question.id] === option;

    if (isCorrect) {
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    }
    
    if (isSelected && !isCorrect) {
      return <XCircle className="h-5 w-5 text-red-600" />;
    }

    return null;
  };

  const getScoreColor = () => {
    const percentage = (score / quiz.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    const percentage = (score / quiz.length) * 100;
    if (percentage === 100) return '🎉 Perfect Score! Outstanding!';
    if (percentage >= 80) return '🌟 Excellent Work!';
    if (percentage >= 60) return '👍 Good Job!';
    if (percentage >= 40) return '📚 Keep Learning!';
    return '💪 Keep Practicing!';
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-2">Take Quiz: {title}</h2>
            <p className="text-gray-600 text-sm md:text-base">
              {showResults 
                ? 'Review your answers below'
                : 'Select your answer for each question, then submit to see your score'
              }
            </p>
          </div>
          {!showResults && (
            <div className="px-4 py-2 bg-purple-100 rounded-xl">
              <span className="text-sm font-semibold text-purple-900">
                {getAnsweredCount()} / {quiz.length} answered
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4 md:space-y-5">
        {quiz.map((question, index) => (
          <div key={question.id} className="glass-card rounded-2xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                <span className="gradient-text">Question {index + 1}</span>
              </h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-xl border-2 self-start ${
                question.difficulty === 'easy' 
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : question.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  : 'bg-red-100 text-red-800 border-red-200'
              }`}>
                {question.difficulty.toUpperCase()}
              </span>
            </div>
            <p className="text-base md:text-lg text-gray-700 mb-5">{question.question_text}</p>
            
            {/* Options */}
            <div className="space-y-3">
              {[
                { label: 'A', value: question.option_a },
                { label: 'B', value: question.option_b },
                { label: 'C', value: question.option_c },
                { label: 'D', value: question.option_d },
              ].map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleAnswerSelect(question.id, option.value)}
                  disabled={showResults}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    getOptionClass(question, option.value)
                  } ${showResults ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-700 min-w-[28px]">{option.label}.</span>
                      <span className="text-sm md:text-base">{option.value}</span>
                    </div>
                    {getOptionIcon(question, option.value)}
                  </div>
                </button>
              ))}
            </div>

            {/* Explanation (shown after submission) */}
            {showResults && question.explanation && (
              <div className="mt-5 p-4 md:p-5 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 rounded-xl">
                <p className="text-sm md:text-base">
                  <span className="font-bold text-purple-900">💡 Explanation: </span>
                  <span className="text-gray-700">{question.explanation}</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-4 z-10">
        <div className="glass-card rounded-2xl p-4 md:p-5 shadow-xl border-2 border-purple-200">
          {!showResults ? (
            <Button
              onClick={handleSubmit}
              disabled={getAnsweredCount() === 0}
              className="w-full h-12 md:h-14 text-base md:text-lg font-semibold rounded-xl btn-gradient"
            >
              Submit Quiz ({getAnsweredCount()} / {quiz.length})
            </Button>
          ) : (
            <Button
              onClick={handleReset}
              className="w-full h-12 md:h-14 text-base md:text-lg font-semibold rounded-xl bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Retake Quiz
            </Button>
          )}
        </div>
      </div>

      {/* Results Card (shown after submission) */}
      {showResults && (
        <div id="quiz-results" className="glass-card rounded-2xl p-8 md:p-10 border-2 border-purple-300 bg-gradient-to-br from-purple-50 via-white to-blue-50">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Award className="h-12 w-12 md:h-14 md:w-14 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
              {getScoreMessage()}
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Your Score: <span className={`font-bold ${getScoreColor()}`}>
                {score} / {quiz.length}
              </span> ({Math.round((score / quiz.length) * 100)}%)
            </p>
            
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <div className="p-5 md:p-6 bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl shadow-sm">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">{score}</div>
                <div className="text-sm md:text-base text-gray-700 font-medium">Correct</div>
              </div>
              <div className="p-5 md:p-6 bg-gradient-to-br from-red-100 to-rose-50 rounded-2xl shadow-sm">
                <div className="text-3xl md:text-4xl font-bold text-red-600 mb-1">{quiz.length - score}</div>
                <div className="text-sm md:text-base text-gray-700 font-medium">Incorrect</div>
              </div>
              <div className="p-5 md:p-6 bg-gradient-to-br from-purple-100 to-blue-50 rounded-2xl shadow-sm">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-1">{quiz.length}</div>
                <div className="text-sm md:text-base text-gray-700 font-medium">Total</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
