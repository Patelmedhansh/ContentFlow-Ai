import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessAlertProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
        <CheckCircle className="w-6 h-6" />
        <span className="font-medium">Content sent to automation pipeline successfully!</span>
        <button
          onClick={onClose}
          className="ml-4 hover:bg-green-600 rounded-full p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};