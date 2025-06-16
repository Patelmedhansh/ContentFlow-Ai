import React, { useState } from 'react';
import { FileText, Upload, Play } from 'lucide-react';
import { ToneType } from '../types';

interface ContentFormProps {
  onSubmit: (content: string, tone: ToneType) => void;
  isLoading: boolean;
}

export const ContentForm: React.FC<ContentFormProps> = ({ onSubmit, isLoading }) => {
  const [content, setContent] = useState('');
  const [tone, setTone] = useState<ToneType>('professional');
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content, tone);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/markdown') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Mode Toggle */}
          <div className="flex items-center space-x-4 mb-6">
            <button
              type="button"
              onClick={() => setInputMode('text')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                inputMode === 'text'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Text Input
            </button>
            <button
              type="button"
              onClick={() => setInputMode('file')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                inputMode === 'file'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Markdown
            </button>
          </div>

          {/* Content Input */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Your Content
            </label>
            {inputMode === 'text' ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your blog ideas, content, or markdown text here..."
                className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700"
                required
              />
            ) : (
              <div className="space-y-4">
                <input
                  type="file"
                  accept=".md,.markdown"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {content && (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700"
                  />
                )}
              </div>
            )}
          </div>

          {/* Tone Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Content Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as ToneType)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="professional">Professional</option>
              <option value="witty">Witty</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Run AI Workflow</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};