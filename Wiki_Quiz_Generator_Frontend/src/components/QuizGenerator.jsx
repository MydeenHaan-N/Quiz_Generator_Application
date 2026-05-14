import { useState, useEffect } from 'react';
import { generateQuiz } from '../services/api';
import { Input } from './ui/input';
import { Button } from './ui/button';
import QuizDisplay from './QuizDisplay';
import { Loader2 } from 'lucide-react';

export default function QuizGenerator({ initialUrl = '', onUrlUsed = () => {} }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState(null);

  // Update URL when initialUrl changes
  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
      onUrlUsed(); // Clear the initial URL after using it
    }
  }, [initialUrl, onUrlUsed]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a Wikipedia URL');
      return;
    }

    if (!url.includes('wikipedia.org/wiki/')) {
      setError('Please enter a valid Wikipedia article URL');
      return;
    }

    setLoading(true);
    setError(null);
    setQuizData(null);

    try {
      const data = await generateQuiz(url, 10);
      setQuizData(data);
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError(
        err.response?.data?.detail || 
        'Failed to generate quiz. Please check the URL and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Input Form */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            Generate Quiz from Wikipedia
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Enter any Wikipedia article URL to create an AI-powered quiz
          </p>
        </div>
        
        <form onSubmit={handleGenerate} className="space-y-4 max-w-2xl mx-auto">
          <div>
            <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">
              Wikipedia Article URL
            </label>
            <Input
              id="url"
              type="url"
              placeholder="https://en.wikipedia.org/wiki/Artificial_intelligence"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 md:h-14 text-base rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 md:h-14 text-base md:text-lg font-semibold rounded-xl btn-gradient"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              'Generate Quiz'
            )}
          </Button>
        </form>

        {loading && (
          <div className="mt-6 md:mt-8 p-6 md:p-8 bg-purple-50 border border-purple-200 rounded-xl">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-purple-600" />
              <div className="text-center">
                <p className="text-base md:text-lg font-semibold text-purple-900">
                  Generating your quiz...
                </p>
                <p className="text-sm text-purple-700 mt-1">
                  This may take 15-30 seconds
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Display */}
      {quizData && <QuizDisplay quizData={quizData} />}
    </div>
  );
}
