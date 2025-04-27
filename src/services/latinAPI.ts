
import { ApiResponse } from "@/types/dictionary";

// Original API URL
const ORIGINAL_API_URL = "https://latin-words.com/cgi-bin/translate.cgi";
// CORS proxy URL - using corsproxy.io as a free public CORS proxy
const PROXY_URL = "https://corsproxy.io/?";

export async function lookupLatinWord(word: string): Promise<ApiResponse> {
  try {
    // Create the proxied URL by encoding the original URL
    const targetUrl = `${ORIGINAL_API_URL}?query=${encodeURIComponent(word)}`;
    const proxiedUrl = `${PROXY_URL}${encodeURIComponent(targetUrl)}`;
    
    // Fetch the data using the proxied URL
    const response = await fetch(proxiedUrl, {
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
