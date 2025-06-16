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
  const [isSubmittingWorkflow, setIsSubmittingWorkflow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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

  const handleWorkflowSubmit = async () => {
    if (!results) return;

    setIsSubmittingWorkflow(true);
    setError(null);

    try {
      // Prepare webhook payload
      const payload: WorkflowPayload = {
        title: results.seoTitle,
        meta: results.metaDescription,
        summary: results.summary,
        posts: results.socialPosts,
        original: originalContent,
        tone: selectedTone,
      };

      // Send to Kestra webhook
      const result = await webhookService.sendToKestra(payload);
      
      if (result.success) {
        setShowSuccess(true);
      } else {
        const errorMsg = result.error || 'Failed to send content to workflow service';
        
        // Provide more helpful error message for connection issues
        if (errorMsg.includes('Unable to connect to Kestra server')) {
          setError(`${errorMsg}\n\nTo use the workflow automation feature:\n1. Set up and start your Kestra instance\n2. Configure the webhook URL in your .env file\n3. Ensure Kestra is accessible at: ${webhookService.getWebhookUrl()}`);
        } else {
          setError(errorMsg);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send to workflow service';
      setError(errorMessage);
    } finally {
      setIsSubmittingWorkflow(false);
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
          onWorkflowSubmit={handleWorkflowSubmit}
          isSubmittingWorkflow={isSubmittingWorkflow}
          webhookConfigured={webhookService.isConfigured()}
        />
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