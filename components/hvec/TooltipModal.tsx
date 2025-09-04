import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface TooltipModalProps {
  title: string;
  content: string | React.ReactNode;
  triggerText?: string;
  triggerIcon?: React.ReactNode;
}

export const TooltipModal: React.FC<TooltipModalProps> = ({ 
  title, 
  content, 
  triggerText,
  triggerIcon = <Info className="w-4 h-4" />
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      <div className="relative inline-block">
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setIsOpen(true)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          {triggerIcon}
        </button>
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50">
            {triggerText || 'Click for more info'}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900"></div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
              {typeof content === 'string' ? (
                <p className="text-gray-700 dark:text-gray-300">{content}</p>
              ) : (
                content
              )}
            </div>
            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};