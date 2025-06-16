import React, { useState } from 'react';
import { Header } from './components/Header';
import { ContentForm } from './components/ContentForm';
import { ResultsSection } from './components/ResultsSection';
import { SuccessAlert } from './components/SuccessAlert';
import { ErrorAlert } from './components/ErrorAlert';
import { openaiService } from './services/openai';
import { webhookService } from './services/webhook';
import { ContentResult, ToneType, WorkflowPayload } from './types';

function App() {
  const [results, setResults] = useState<ContentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleContentSubmit = async (content: string, tone: ToneType) => {
    setIsLoading(true);
    setError(null);
    setShowResults(false);

    try {
      // Generate AI content
      const contentResult = await openaiService.processContent(content, tone);
      setResults(contentResult);
      setShowResults(true);

      // Prepare webhook payload
      const payload: WorkflowPayload = {
        title: contentResult.seoTitle,
        meta: contentResult.metaDescription,
        summary: contentResult.summary,
        posts: contentResult.socialPosts,
        original: content,
        tone: tone,
      };

      // Send to Kestra webhook
      const webhookSuccess = await webhookService.sendToKestra(payload);
      
      if (webhookSuccess) {
        setShowSuccess(true);
      } else {
        setError('Content generated successfully, but failed to send to workflow service');
      }
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
        <ResultsSection results={results} isVisible={showResults} />
      </div>

      <SuccessAlert 
        isVisible={showSuccess} 
        onClose={() => setShowSuccess(false)} 
      />
      
      <ErrorAlert 
        isVisible={!!error} 
        message={error || ''} 
        onClose={() => setError(null)} 
      />
    </div>
  );
}

export default App;