import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ResultCardProps {
  title: string;
  content: string | string[];
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, content, icon, color, bgColor }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = Array.isArray(content) ? content.join('\n• ') : content;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${bgColor} rounded-xl p-6 shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-white shadow-sm ${color}`}>
            {icon}
          </div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <Copy className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
      
      <div className="text-gray-700">
        {Array.isArray(content) ? (
          <ul className="space-y-2">
            {content.map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="leading-relaxed">{content}</p>
        )}
      </div>
    </div>
  );
};