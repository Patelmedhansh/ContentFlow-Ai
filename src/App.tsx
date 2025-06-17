import React, { useState } from 'react';
import { Header } from './components/Header';
import { ContentForm } from './components/ContentForm';
import { ResultsSection } from './components/ResultsSection';
import { PublishSection } from './components/PublishSection';
import { ErrorAlert } from './components/ErrorAlert';
import { openaiService } from './services/openai';
import { ContentResult, ToneType } from './types';

function App() {
  const [results, setResults] = useState<ContentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [originalContent, setOriginalContent] = useState('');
  const [selectedTone, setSelectedTone] = useState<ToneType>('professional');

  const handleContentSubmit = async (content: string, tone: ToneType) => {
    setIsLoading(true);
    setError(null);
    setShowResults(false);
    setOriginalContent(content);
    setSelectedTone(tone);

    try {
      // Generate AI content
      const contentResult = await openaiService.processContent(content, tone);
      setResults(contentResult);
      setShowResults(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <ContentForm onSubmit={handleContentSubmit} isLoading={isLoading} />
        <ResultsSection 
          results={results} 
          isVisible={showResults}
        />
        {results && showResults && (
          <PublishSection
            results={results}
            originalContent={originalContent}
            isVisible={showResults}
          />
        )}
      </div>

      <ErrorAlert 
        isVisible={!!error} 
        message={error || ''} 
        onClose={() => setError(null)} 
      />
    </div>
  );
}

export default App;