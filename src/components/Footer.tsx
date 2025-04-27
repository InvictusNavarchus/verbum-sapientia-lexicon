
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 py-6 bg-dict-dark text-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-serif font-bold mb-2">Verbum Sapientia Lexicon</h3>
            <p className="text-dict-light text-sm">
              A modern Latin dictionary and word reference tool for students, scholars, and enthusiasts.
            </p>
          </div>
          <div>
            <h4 className="text-md font-serif font-bold mb-2">About</h4>
            <p className="text-dict-light text-sm">
              This dictionary uses the Latin Words API to provide accurate translations and grammatical information for Latin words. 
              Perfect for students studying Latin or scholars working with classical texts.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-dict-secondary text-center text-xs text-dict-light">
          <p>© {new Date().getFullYear()} Verbum Sapientia Lexicon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
