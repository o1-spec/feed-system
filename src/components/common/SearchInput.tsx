'use client';

import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export const SearchInput = ({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
}: SearchInputProps) => {
  const [value, setValue] = useState('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeout = setTimeout(() => {
        onSearch(newValue);
      }, debounceMs);

      setTimeoutId(newTimeout);
    },
    [debounceMs, onSearch, timeoutId]
  );

  const handleClear = useCallback(() => {
    setValue('');
    onSearch('');
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }, [onSearch, timeoutId]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
