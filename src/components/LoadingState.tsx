
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-t-4 border-dict-primary rounded-full animate-spin"></div>
        <div className="absolute inset-3 border-t-3 border-dict-secondary rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
      </div>
      <p className="text-dict-secondary mt-4 font-serif italic">Quaerendo...</p>
      <p className="text-dict-neutral text-sm mt-1">Searching...</p>
    </div>
  );
};

export default LoadingState;
