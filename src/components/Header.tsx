import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="text-center py-8 px-4">
      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          <Zap className="w-8 h-8 text-blue-600 mr-2" />
          <Sparkles className="w-4 h-4 text-purple-500 absolute -top-1 -right-1" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          ContentFlow AI
        </h1>
      </div>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Transform your content with AI-powered SEO optimization, summaries, and social media posts
      </p>
    </header>
  );
};