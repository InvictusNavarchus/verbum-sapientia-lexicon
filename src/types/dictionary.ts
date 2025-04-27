
// Dictionary API response types
export interface ApiResponse {
  status: string;
  message: string;
}

// Parsed dictionary entry
export interface DictionaryEntry {
  lemma: string;
  pos: string;
  details: string;
  notes: string[];
  definitions: string[];
}

// Grammatical form analysis
export interface GrammaticalForm {
  inflectedForm: string;
  pos: string;
  codes: string;
}

// Parsed response from the API
export interface ParsedDictionaryResponse {
  entries: DictionaryEntry[];
  grammaticalForms: GrammaticalForm[];
  notes: string[];
  unknown: boolean;
}

// Search state
export interface SearchState {
  word: string;
  isLoading: boolean;
  data: ParsedDictionaryResponse | null;
  error: string | null;
}
