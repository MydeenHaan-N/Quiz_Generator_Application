import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import QuizGenerator from './components/QuizGenerator';
import QuizHistory from './components/QuizHistory';
import { BookOpen, Sparkles, History } from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [randomUrl, setRandomUrl] = useState('');

  const sampleWikiUrls = [
    'https://en.wikipedia.org/wiki/Artificial_intelligence',
    'https://en.wikipedia.org/wiki/Quantum_computing',
    'https://en.wikipedia.org/wiki/Climate_change',
    'https://en.wikipedia.org/wiki/Ancient_Egypt',
    'https://en.wikipedia.org/wiki/Space_exploration'
  ];

  const handleGetStarted = () => {
    const randomIndex = Math.floor(Math.random() * sampleWikiUrls.length);
    const selectedUrl = sampleWikiUrls[randomIndex];
    setRandomUrl(selectedUrl);
    setActiveTab('generate');
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold gradient-text">
                  AI Wiki Quiz Generator
                </h1>
                <p className="text-xs md:text-sm text-gray-600 hidden sm:block">
                  Generate quizzes from Wikipedia articles
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={handleGetStarted}
                className="px-4 py-2 md:px-6 md:py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white text-sm md:text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Try Random Quiz
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 md:space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto glass-card p-1.5">
            <TabsTrigger 
              value="generate"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-md transition-all duration-200"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Generate Quiz</span>
              <span className="sm:hidden">Generate</span>
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-md transition-all duration-200"
            >
              <History className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Past Quizzes</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <QuizGenerator initialUrl={randomUrl} onUrlUsed={() => setRandomUrl('')} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <QuizHistory />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-12 md:mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="text-center text-sm text-gray-600">
            <p>Built with ❤️ using FastAPI, React, and Google Gemini AI</p>
            <p className="mt-2 text-xs text-gray-500">
              © 2025 AI Wiki Quiz Generator. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
