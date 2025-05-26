import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApi } from 'unsplash-js';
import fetch from 'node-fetch'; // Required for unsplash-js in Node environment

// Initialize Unsplash API
// Ensure UNSPLASH_ACCESS_KEY is set in Vercel environment variables
const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

if (!unsplashAccessKey) {
  console.error("Unsplash Access Key not configured on server.");
  // Optionally, you could have a default placeholder behavior or throw during build
}

// unsplash-js requires a fetch implementation. Node's global fetch is experimental.
// @ts-ignore
global.fetch = fetch;

const unsplash = unsplashAccessKey ? createApi({ accessKey: unsplashAccessKey }) : null;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', ['GET']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }

  if (!unsplash) {
    console.error("Unsplash API client not initialized. Check UNSPLASH_ACCESS_KEY.");
    return response.status(500).json({ error: "Image service not configured on server." });
  }

  const query = request.query.query as string;

  if (!query) {
    return response.status(400).json({ error: "Search query not provided." });
  }

  try {
    const result = await unsplash.search.getPhotos({
      query: query,
      page: 1,
      perPage: 1,
      orientation: 'landscape',
    });

    if (result.errors) {
      console.error('Unsplash API error:', result.errors);
      return response.status(500).json({ error: 'Failed to fetch image from Unsplash.', details: result.errors });
    }

    const photo = result.response?.results[0];

    if (photo) {
      return response.status(200).json({ imageUrl: photo.urls.regular, altText: photo.alt_description || query });
    } else {
      // Fallback or generic image if no results - or let the main API handle a fallback
      console.warn(`No Unsplash image found for query: ${query}`);
      return response.status(404).json({ error: 'No image found for this query.' });
    }
  } catch (error: any) {
    console.error("Error fetching image from Unsplash:", error);
    return response.status(500).json({ error: "Failed to fetch image.", details: error.message });
  }
} 