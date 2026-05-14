import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Check } from 'lucide-react';

export default function QuestionCard({ question, questionNumber, difficultyColors }) {
  const options = [
    question.option_a,
    question.option_b,
    question.option_c,
    question.option_d,
  ];

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
          <span className="gradient-text mr-2">Q{questionNumber}.</span>
          {question.question_text}
        </h3>
        <span
          className={`px-3 py-1 rounded-xl text-xs font-semibold border-2 self-start ${
            difficultyColors[question.difficulty] || difficultyColors.medium
          }`}
        >
          {question.difficulty.toUpperCase()}
        </span>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-5">
        {options.map((option, idx) => {
          const isCorrect = option === question.correct_answer;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border-2 transition-all ${
                isCorrect
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-purple-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`font-bold min-w-[28px] text-base ${
                  isCorrect ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className={`flex-1 text-sm md:text-base ${
                  isCorrect ? 'text-green-900 font-medium' : 'text-gray-700'
                }`}>
                  {option}
                </span>
                {isCorrect && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {question.explanation && (
        <div className="p-4 md:p-5 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 rounded-xl">
          <p className="text-sm md:text-base">
            <span className="font-bold text-purple-900">💡 Explanation: </span>
            <span className="text-gray-700">{question.explanation}</span>
          </p>
        </div>
      )}
    </div>
  );
}
