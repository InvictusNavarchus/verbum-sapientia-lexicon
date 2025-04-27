
import { ApiResponse, ParsedDictionaryResponse } from "@/types/dictionary";

// Regex patterns for parsing the API response
const patterns = {
  // Matches lines describing the grammatical form of the queried word
  // e.g., "abund.ans   VPAR   1 1 NOM S X PRES ACTIVE  PPL"
  grammaticalInfo: /^([\w.]+)\s+([A-Z]+)\s+(.+)$/,

  // Matches the main dictionary entry line (lemma, POS, details)
  // e.g., "abundo, abundare, abundavi, abundatus  V (1st)  [XXXAO]"
  dictionaryEntry: /^([\w\s\(\),āēīōūĀĒĪŌŪ-]+?)\s+(ADJ|N|V|ADV|PREP|CONJ|INTERJ|PRON|NUM|VPAR|TACKON|SUFFIX|PREFIX)\b(.*)$/,

  // Specific note lines
  unknown: /^\s*========\s+UNKNOWN\s*$/,
  twoWords: /^\s*Two words/,
  wordMod: /^\s*Word mod/,
  syncope: /^\s*Syncope/,
  prefix: /^\s*-\s*PREFIX\s*/,
  suffix: /^\s*-\s*SUFFIX\s*/,

  // General noise/ignore lines
  ignoreLine: /^[\s\*=\-]+$/,
};

export function parseResponse(response: ApiResponse): ParsedDictionaryResponse {
  if (response.status !== "ok" || typeof response.message !== 'string') {
    console.warn("Invalid response format or error status");
    return { 
      entries: [], 
      grammaticalForms: [], 
      notes: ["Invalid API response format"], 
      unknown: false 
    };
  }

  const lines = response.message.split('\n');
  const result: ParsedDictionaryResponse = {
    entries: [],
    grammaticalForms: [],
    notes: [],
    unknown: false
  };

  let currentEntry = null;
  let definitionBuffer: string[] = [];

  // Function to process and add the current entry to results
  const flushEntry = () => {
    if (currentEntry) {
      // Process buffered definition lines
      const rawDefinitions = definitionBuffer.join(' ').trim();
      if (rawDefinitions) {
        // Split by semicolon, mindful of potential semicolons within definitions
        currentEntry.definitions = rawDefinitions.split(';')
          .map(def => def.trim())
          .filter(def => def && !patterns.ignoreLine.test(def));
      }
      result.entries.push(currentEntry);
      console.debug(`Entry processed: ${currentEntry.lemma}, Definitions: ${currentEntry.definitions.length}`);
    }
    currentEntry = null;
    definitionBuffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, '').trim();

    if (!line || patterns.ignoreLine.test(line)) {
      continue; // Skip empty lines or separator lines
    }

    console.debug(`Processing line: "${line}"`);

    // Check for specific note patterns first
    if (patterns.unknown.test(line)) {
      console.debug("-> Matched UNKNOWN");
      result.notes.push("Word not found in dictionary.");
      result.unknown = true;
      flushEntry();
      continue;
    }
    
    if (patterns.twoWords.test(line)) {
      console.debug("-> Matched Two Words");
      result.notes.push("API suggests input might be two words.");
      continue;
    }
    
    if (patterns.wordMod.test(line) || patterns.syncope.test(line)) {
      console.debug("-> Matched Word Mod/Syncope");
      const noteText = line;
      if (currentEntry) currentEntry.notes.push(noteText);
      else result.notes.push(noteText);
      continue;
    }

    // Attempt to match dictionary entry
    let match = line.match(patterns.dictionaryEntry);
    if (match) {
      const potentialLemma = match[1].trim();
      const potentialPos = match[2];
      const potentialDetails = match[3].trim();

      // Avoid misinterpreting grammar lines as dictionary entries
      const looksLikeGrammar = /^[A-Z]$/.test(potentialPos) && /^\s*[\dA-Z\s]+/.test(potentialDetails);

      if (!looksLikeGrammar) {
        console.debug(`-> Matched Dictionary Entry: Lemma="${potentialLemma}", POS="${potentialPos}", Details="${potentialDetails}"`);
        flushEntry(); // Flush the previous entry before starting a new one

        currentEntry = {
          lemma: potentialLemma,
          pos: potentialPos,
          details: potentialDetails,
          notes: [],
          definitions: []
        };

        // Extract frequency/usage notes from details
        const detailParts = potentialDetails.split(/\s{2,}/);
        const notes = detailParts.filter(part => /\[[A-Z]+\]|^\w+$/.test(part.trim()));
        currentEntry.notes.push(...notes);

        // Special case for parts of speech that often include definitions on the same line
        if (['PREP', 'ADV', 'CONJ', 'TACKON'].includes(potentialPos)) {
          const definitionPart = potentialDetails
            .replace(/\[.*?\]|\b(Late|Classic|Early|Medieval|NeoLatin|uncommon|veryrare|lesser|Pliny)\b/gi, '')
            .trim();
          
          if (definitionPart && definitionPart.length > 5) {
            definitionBuffer.push(definitionPart);
            console.debug(`   -> Found inline definition: "${definitionPart}"`);
          }
        }
        continue;
      } else {
        console.debug(`   -> Dictionary match rejected as likely grammar: "${line}"`);
      }
    }

    // Attempt to match grammatical info line
    match = line.match(patterns.grammaticalInfo);
    if (match) {
      console.debug(`-> Matched Grammatical Info: Word="${match[1]}", POS="${match[2]}", Codes="${match[3]}"`);
      result.grammaticalForms.push({
        inflectedForm: match[1],
        pos: match[2],
        codes: match[3].trim()
      });
      continue;
    }

    // If it's none of the above, assume it's a definition line
    console.debug(`-> Matched Definition Line (default): "${line}"`);
    if (currentEntry) {
      definitionBuffer.push(line);
    } else {
      // Definition line found before any dictionary entry? Add as a general note.
      result.notes.push(`Orphaned line: ${line}`);
    }
  }

  // Flush the last entry after the loop finishes
  flushEntry();

  // Final check for empty results
  if (result.entries.length === 0 && result.grammaticalForms.length === 0 && !result.unknown) {
    if (result.notes.length === 0) {
      result.notes.push("No parseable information found.");
    }
    console.warn("Parsing resulted in no entries or grammatical forms.");
  }

  return result;
}
