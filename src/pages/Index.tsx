
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import LoadingState from '@/components/LoadingState';
import WordResult from '@/components/WordResult';
import { lookupLatinWord, stripMacrons } from '@/services/latinAPI';
import { parseResponse } from '@/utils/responseParser';
import { SearchState } from '@/types/dictionary';
import { useToast } from '@/components/ui/use-toast';

const Index: React.FC = () => {
  const { toast } = useToast();
  const [searchState, setSearchState] = useState<SearchState>({
    word: '',
    isLoading: false,
    data: null,
    error: null
  });

  const handleSearch = async (word: string) => {
    if (!word.trim()) return;
    
    // Update state to loading
    setSearchState({
      word: word,
      isLoading: true,
      data: null,
      error: null
    });
    
    try {
      // Strip macrons before API lookup
      const normalizedWord = stripMacrons(word);
      
      // Fetch from API
      const response = await lookupLatinWord(normalizedWord);
      
      // Check response status
      if (response.status !== 'ok') {
        throw new Error(response.message || 'Failed to fetch word data');
      }
      
      // Parse the response
      const parsedData = parseResponse(response);
      
      // Update state with results
      setSearchState({
        word: word,
        isLoading: false,
        data: parsedData,
        error: null
      });
      
      // Show notification if word is unknown
      if (parsedData.unknown) {
        toast({
          title: "Word not found",
          description: `"${word}" was not found in the dictionary.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during search:', error);
      
      // Update state with error
      setSearchState({
        word: word,
        isLoading: false,
        data: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
      
      // Show error notification
      toast({
        title: "Search Error",
        description: error instanceof Error ? error.message : 'Failed to search for the word',
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-dict-light/20 to-white py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-dict-dark mb-3">
                Latin Dictionary
              </h1>
              <p className="text-dict-neutral text-lg max-w-2xl mx-auto">
                Look up Latin words to find their meanings, grammatical forms, and usage notes
              </p>
            </div>
            
            <SearchBar 
              onSearch={handleSearch} 
              isLoading={searchState.isLoading} 
            />
          </div>
        </section>
        
        <section className="py-8 dictionary-content">
          {searchState.isLoading && <LoadingState />}
          
          {searchState.error && (
            <div className="mt-8 p-6 bg-white rounded-lg shadow-md border-l-4 border-destructive">
              <h3 className="text-xl font-medium text-destructive mb-2">Error</h3>
              <p>{searchState.error}</p>
            </div>
          )}
          
          {!searchState.isLoading && !searchState.error && searchState.data && (
            <WordResult 
              data={searchState.data} 
              searchedWord={searchState.word} 
            />
          )}
          
          {!searchState.isLoading && !searchState.word && (
            <div className="mt-12 text-center">
              <p className="text-dict-neutral font-serif text-xl italic">
                "Verba volant, scripta manent"
              </p>
              <p className="text-dict-neutral text-sm mt-2">
                Spoken words fly away, written words remain
              </p>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
