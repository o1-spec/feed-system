'use client';

import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({
  icon = <Inbox className="w-12 h-12 text-gray-400 mb-4" />,
  title = 'Nothing here yet',
  message = 'No content available at the moment.',
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
        {message}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
