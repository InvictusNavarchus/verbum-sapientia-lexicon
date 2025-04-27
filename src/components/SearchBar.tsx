
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (word: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Enter a Latin word..."
            className="pl-10 py-6 text-lg bg-white border-2 border-dict-light focus:border-dict-primary transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dict-neutral" size={20} />
        </div>
        <Button
          type="submit"
          className="bg-dict-secondary hover:bg-dict-primary text-white py-6 px-6 text-lg transition-colors"
          disabled={isLoading || !searchTerm.trim()}
        >
          Search
        </Button>
      </form>
      <p className="text-sm text-dict-neutral mt-2 text-center">
        Try: "amo", "cogito", "fortis", "pax", "veritas"
      </p>
    </div>
  );
};

export default SearchBar;
