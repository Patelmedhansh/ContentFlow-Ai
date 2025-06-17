import React from 'react';
import { Eye, Code, Copy, Check } from 'lucide-react';
import { MarkdownPreview as MarkdownPreviewType } from '../types';

interface MarkdownPreviewProps {
  preview: MarkdownPreviewType;
  isVisible: boolean;
  onClose: () => void;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ preview, isVisible, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'preview' | 'raw'>('preview');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(preview.fullMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Markdown Preview</h3>
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-1" />
                Preview
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'raw'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Code className="w-4 h-4 inline mr-1" />
                Raw
              </button>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Copy markdown"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-semibold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {activeTab === 'preview' ? (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Frontmatter</h4>
                <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
                  {preview.frontmatter}
                </pre>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Content</h4>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {preview.content}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-4">
              <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                {preview.fullMarkdown}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};