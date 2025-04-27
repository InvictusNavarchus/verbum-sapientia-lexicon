
import React from 'react';
import { ParsedDictionaryResponse } from '@/types/dictionary';
import { Separator } from '@/components/ui/separator';

interface WordResultProps {
  data: ParsedDictionaryResponse;
  searchedWord: string;
}

const WordResult: React.FC<WordResultProps> = ({ data, searchedWord }) => {
  const { entries, grammaticalForms, notes, unknown } = data;
  
  if (unknown) {
    return (
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md animate-fade-in-up">
        <div className="flex items-center text-destructive mb-4">
          <span className="text-xl font-serif font-bold">{searchedWord}</span>
          <span className="text-sm ml-2 italic">non invenitur</span>
        </div>
        <p className="text-dict-darkgray">
          This word was not found in our Latin dictionary. Please check the spelling or try another word.
        </p>
      </div>
    );
  }
  
  if (entries.length === 0 && grammaticalForms.length === 0) {
    return (
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md animate-fade-in-up">
        <div className="flex items-center text-dict-neutral mb-4">
          <span className="text-xl font-serif font-bold">{searchedWord}</span>
        </div>
        <p className="text-dict-darkgray">
          {notes.length > 0 
            ? notes.map((note, i) => <div key={i}>{note}</div>)
            : "No information could be found for this word."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md dictionary-result">
      {/* Word Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-dict-secondary">
          {searchedWord}
        </h2>
        {notes.length > 0 && (
          <div className="mt-2 text-sm text-dict-neutral italic">
            {notes.filter(note => !note.startsWith("Orphaned line:")).map((note, i) => (
              <div key={i}>{note}</div>
            ))}
          </div>
        )}
      </div>

      {/* Grammatical Forms Section */}
      {grammaticalForms.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-dict-dark mb-2">Grammatical Analysis</h3>
          <div className="bg-dict-lightgray rounded-md p-4">
            <ul className="space-y-1">
              {grammaticalForms.map((form, index) => (
                <li key={index} className="flex flex-wrap gap-2">
                  <span className="font-serif font-medium">{form.inflectedForm}</span>
                  <span className="text-dict-secondary font-mono text-sm">{form.pos}</span>
                  <span className="text-dict-neutral text-sm">{form.codes}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Dictionary Entries */}
      {entries.map((entry, index) => (
        <div key={index} className={`${index > 0 ? 'mt-8' : ''}`}>
          {index > 0 && <Separator className="mb-6" />}
          
          <div className="flex flex-wrap items-baseline gap-2 mb-3">
            <h3 className="font-serif font-bold text-xl text-dict-dark">
              {entry.lemma}
            </h3>
            <span className="text-dict-secondary font-medium">
              {entry.pos}
            </span>
            {entry.details && (
              <span className="text-dict-neutral text-sm">
                {entry.details}
              </span>
            )}
          </div>
          
          {entry.notes.length > 0 && (
            <div className="mb-3 text-sm text-dict-neutral italic">
              {entry.notes.join(' ')}
            </div>
          )}
          
          {entry.definitions.length > 0 ? (
            <div className="pl-0">
              <ul className="space-y-1.5 list-disc pl-6">
                {entry.definitions.map((definition, i) => (
                  <li key={i} className="text-dict-darkgray">{definition}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-dict-neutral italic">No definitions provided.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default WordResult;
