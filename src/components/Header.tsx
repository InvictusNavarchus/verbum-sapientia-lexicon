
import React from 'react';
import { BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-dict-primary py-4 shadow-lg">
      <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-white" />
          <div>
            <h1 className="text-white text-2xl font-serif font-bold">Verbum Sapientia Lexicon</h1>
            <p className="text-dict-light text-sm">Latin Dictionary & Word Reference</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
