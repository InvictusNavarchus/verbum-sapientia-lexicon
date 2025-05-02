
# Verbum Sapientia Lexicon

A modern Latin dictionary web application that allows users to search for Latin words and view their definitions, grammatical forms, and usage notes.

## Features

- **Word Search**: Look up any Latin word to find its definitions and grammatical information
- **Automatic Macron Detection**: Searches work with or without macrons on vowels (ā, ē, ī, ō, ū)
- **Detailed Word Analysis**: View comprehensive information about each word:
  - Dictionary entries with part of speech and principal parts
  - Grammatical form analysis
  - Multiple definitions with usage contexts
  - Etymological notes where available
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Implementation

### API Integration

The application uses a proxy service to communicate with the Latin Words API:

```typescript
// API request format
const response = await fetch(`${PROXY_URL}?query=${encodeURIComponent(word)}`);
```

### Response Format

The API returns structured data that is processed into the following format:

- **Dictionary entries**: Lemma forms, part of speech, grammatical details
- **Grammatical forms**: Analysis of the specific queried form
- **Notes**: Additional context and information
- **Unknown status**: Boolean indicating if the word was found in the dictionary

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build System**: Vite
- **API Handling**: Custom proxy to bypass CORS restrictions

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/verbum-sapientia-lexicon.git
cd verbum-sapientia-lexicon
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Deployment

The application is deployed and can be accessed at:
[https://lovable.dev/projects/7c7ec65a-e1d4-4d00-84ac-4b56452a6d7f](https://lovable.dev/projects/7c7ec65a-e1d4-4d00-84ac-4b56452a6d7f)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Latin-Words.com for the dictionary API service
- Inspired by the Latin word lookup userscript by Invictus
