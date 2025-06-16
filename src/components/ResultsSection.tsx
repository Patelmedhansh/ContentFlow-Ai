import React from 'react';
import { Search, FileText, Share2, MessageSquare, Copy, Send, Loader2 } from 'lucide-react';
import { ContentResult } from '../types';
import { ResultCard } from './ResultCard';

interface ResultsSectionProps {
  results: ContentResult | null;
  isVisible: boolean;
  onWorkflowSubmit: () => void;
  isSubmittingWorkflow: boolean;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ 
  results, 
  isVisible, 
  onWorkflowSubmit,
  isSubmittingWorkflow 
}) => {
  if (!results || !isVisible) return null;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          AI-Generated Content Results
        </h2>
        <p className="text-gray-600 mb-6">
          Review your generated content below. When you're satisfied, send it to your content automation pipeline.
        </p>
        
        <button
          onClick={onWorkflowSubmit}
          disabled={isSubmittingWorkflow}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-8 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mx-auto"
        >
          {isSubmittingWorkflow ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Publishing via automation proxy...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send to Content Automation Pipeline</span>
            </>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResultCard
          title="SEO Title"
          content={results.seoTitle}
          icon={<Search className="w-5 h-5" />}
          color="text-blue-600"
          bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
        />
        
        <ResultCard
          title="Meta Description"
          content={results.metaDescription}
          icon={<FileText className="w-5 h-5" />}
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
        />
        
        <ResultCard
          title="Content Summary"
          content={results.summary}
          icon={<Share2 className="w-5 h-5" />}
          color="text-green-600"
          bgColor="bg-gradient-to-br from-green-50 to-green-100"
        />
        
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-white shadow-sm text-pink-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-800">Social Media Posts</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-gray-600">LinkedIn</h4>
                  <button
                    onClick={() => navigator.clipboard.writeText(results.socialPosts.linkedin)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{results.socialPosts.linkedin}</p>
              </div>
              
              <div className="bg-white/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-gray-600">Twitter</h4>
                  <button
                    onClick={() => navigator.clipboard.writeText(results.socialPosts.twitter)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{results.socialPosts.twitter}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};