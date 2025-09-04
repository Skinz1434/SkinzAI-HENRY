'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  disabled?: boolean;
}

export default function Tooltip({ 
  content, 
  children, 
  placement = 'top', 
  delay = 300,
  className = '',
  disabled = false
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    if (disabled) return;
    
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        let x = 0;
        let y = 0;
        
        switch (placement) {
          case 'top':
            x = rect.left + scrollLeft + rect.width / 2;
            y = rect.top + scrollTop - 8;
            break;
          case 'bottom':
            x = rect.left + scrollLeft + rect.width / 2;
            y = rect.bottom + scrollTop + 8;
            break;
          case 'left':
            x = rect.left + scrollLeft - 8;
            y = rect.top + scrollTop + rect.height / 2;
            break;
          case 'right':
            x = rect.right + scrollLeft + 8;
            y = rect.top + scrollTop + rect.height / 2;
            break;
        }
        
        setPosition({ x, y });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getTooltipClasses = () => {
    const baseClasses = `
      absolute z-[9999] px-3 py-2 text-sm text-white bg-gray-900 border border-gray-700 
      rounded-lg shadow-xl backdrop-blur-sm max-w-xs transition-opacity duration-200
      ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `;
    
    const placementClasses = {
      top: 'transform -translate-x-1/2 -translate-y-full',
      bottom: 'transform -translate-x-1/2',
      left: 'transform -translate-x-full -translate-y-1/2',
      right: 'transform -translate-y-1/2'
    };
    
    return `${baseClasses} ${placementClasses[placement]} ${className}`;
  };

  const tooltipElement = (
    <div
      ref={tooltipRef}
      className={getTooltipClasses()}
      style={{ left: position.x, top: position.y }}
    >
      {content}
      {/* Arrow */}
      <div
        className={`absolute w-2 h-2 bg-gray-900 border-gray-700 transform rotate-45 ${
          placement === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2 border-r border-b' :
          placement === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2 border-l border-t' :
          placement === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2 border-t border-r' :
          'left-[-4px] top-1/2 -translate-y-1/2 border-b border-l'
        }`}
      />
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      {typeof window !== 'undefined' && createPortal(tooltipElement, document.body)}
    </>
  );
}
