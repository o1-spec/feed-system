'use client';

import { RefreshCw } from 'lucide-react';

interface RetryButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  label?: string;
}

export const RetryButton = ({
  onClick,
  isLoading = false,
  label = 'Try Again',
}: RetryButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
    >
      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
      {label}
    </button>
  );
};
