import { useState, useEffect } from 'react';
import { getAllQuizzes, getQuizById } from '../services/api';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import DetailsModal from './DetailsModal';
import TakeQuizMode from './TakeQuizMode';
import { ExternalLink, Calendar, Eye, Play, ArrowLeft, Grid3x3, Table2, ArrowUpDown } from 'lucide-react';

export default function QuizHistory() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [takeQuizData, setTakeQuizData] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await getAllQuizzes();
      setQuizzes(data.articles || []);
    } catch (err) {
      console.error('Error loading quizzes:', err);
      setError('Failed to load quiz history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleTakeQuiz = async (quizId) => {
    setLoadingQuiz(true);
    try {
      const data = await getQuizById(quizId);
      setTakeQuizData(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error loading quiz:', err);
      alert('Failed to load quiz. Please try again.');
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleBackToHistory = () => {
    setTakeQuizData(null);
  };

  // Sort quizzes based on selected order
  const sortedQuizzes = [...quizzes].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'table' ? 'grid' : 'table');
  };

  // If taking a quiz, show TakeQuizMode component
  if (takeQuizData) {
    return (
      <div>
        <Button 
          onClick={handleBackToHistory} 
          className="mb-4 md:mb-6 h-10 md:h-12 px-4 md:px-6 rounded-xl border-2 border-purple-300 bg-white text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Button>
        <TakeQuizMode quiz={takeQuizData.quiz} title={takeQuizData.title} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading quiz history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl">
        <p>{error}</p>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-3">No Quizzes Yet</h2>
        <p className="text-gray-600 text-base md:text-lg">
          Generate your first quiz from the "Generate Quiz" tab!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold gradient-text">Past Quizzes</h2>
        
        {/* View Controls */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={toggleSortOrder}
            className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-medium"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
          </Button>
          
          <div className="flex border-2 border-purple-300 rounded-xl overflow-hidden">
            <Button
              onClick={() => setViewMode('table')}
              className={`rounded-none border-0 ${
                viewMode === 'table' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' 
                  : 'bg-white text-purple-700 hover:bg-purple-50'
              }`}
            >
              <Table2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setViewMode('grid')}
              className={`rounded-none border-0 border-l-2 border-purple-300 ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' 
                  : 'bg-white text-purple-700 hover:bg-purple-50'
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Table View */}
      {viewMode === 'table' && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-100 to-blue-100 border-b-2 border-purple-200">
                  <th className="p-4 text-left font-bold text-gray-900">Title</th>
                  <th className="p-4 text-left font-bold text-gray-900">URL</th>
                  <th className="p-4 text-left font-bold text-gray-900">Created</th>
                  <th className="p-4 text-left font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedQuizzes.map((quiz) => (
                  <tr key={quiz.id} className="border-b border-gray-200 hover:bg-purple-50/50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">{quiz.title}</td>
                    <td className="p-4">
                      <a
                        href={quiz.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 flex items-center gap-1 hover:underline font-medium"
                      >
                        <span className="truncate max-w-xs">
                          {quiz.url.replace('https://en.wikipedia.org/wiki/', '')}
                        </span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        {formatDate(quiz.created_at)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleTakeQuiz(quiz.id)}
                          disabled={loadingQuiz}
                          className="btn-gradient h-9 px-4 rounded-lg text-sm font-semibold flex items-center gap-1"
                        >
                          <Play className="h-4 w-4" />
                          Take Quiz
                        </Button>
                        <Button
                          onClick={() => setSelectedQuizId(quiz.id)}
                          className="h-9 px-4 rounded-lg text-sm font-semibold bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sortedQuizzes.map((quiz) => (
            <div key={quiz.id} className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-105">
              <div className="flex justify-end items-start mb-3">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Calendar className="h-3 w-3 text-purple-600" />
                  {formatDate(quiz.created_at)}
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 line-clamp-2">{quiz.title}</h3>
              
              <a
                href={quiz.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1 mb-4 hover:underline font-medium"
              >
                <span className="truncate">
                  {quiz.url.replace('https://en.wikipedia.org/wiki/', '')}
                </span>
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
              </a>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleTakeQuiz(quiz.id)}
                  disabled={loadingQuiz}
                  className="flex-1 btn-gradient h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Take Quiz
                </Button>
                <Button
                  onClick={() => setSelectedQuizId(quiz.id)}
                  className="flex-1 h-10 rounded-lg text-sm font-semibold bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center justify-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedQuizId && (
        <DetailsModal
          quizId={selectedQuizId}
          onClose={() => setSelectedQuizId(null)}
        />
      )}
    </div>
  );
}
