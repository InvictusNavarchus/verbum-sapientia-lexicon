import { ApiResponse } from "@/types/dictionary";

// Custom proxy URL that handles CORS
const PROXY_URL = "https://latin-words-com-proxy.vercel.app/api";

export async function lookupLatinWord(word: string): Promise<ApiResponse> {
  try {
    // Create the URL with query parameter
    const url = `${PROXY_URL}?query=${encodeURIComponent(word)}`;
    
    // Fetch the data from custom proxy
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();
    return data as ApiResponse;
  } catch (error) {
    console.error("Error fetching Latin word:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

// Function to strip macrons from Latin vowels
export function stripMacrons(word: string): string {
  return word
    .replace(/[āĀ]/g, 'a')
    .replace(/[ēĒ]/g, 'e')
    .replace(/[īĪ]/g, 'i')
    .replace(/[ōŌ]/g, 'o')
    .replace(/[ūŪ]/g, 'u');
}
