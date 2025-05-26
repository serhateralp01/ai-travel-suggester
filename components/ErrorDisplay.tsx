import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="my-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-md shadow-md" role="alert">
      <strong className="font-bold text-red-200">Oops! Something went wrong.</strong>
      <p className="mt-1 text-sm">{message}</p>
      <p className="mt-2 text-xs text-red-400">Please check your API key configuration or try again later.</p>
    </div>
  );
};