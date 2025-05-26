import OpenAI from 'openai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Duplicating type definitions here to resolve persistent import issues
interface UserPreferences {
  holidayType: string;
  budget: string;
  companions: string;
  climate: string;
  interests: string;
  duration: string;
  travelMonth?: string;
}

interface DestinationSuggestion {
  name: string;
  description: string;
  matchReason: string;
  detailedReasoning: string;
  suitability: string;
  imageUrl: string; 
  imageSearchQuery?: string;
  googleMapsUrl: string;
  tripAdvisorUrl: string;
  nearestAirports: string;
  mustDoActivities?: string[];
}
// End of duplicated type definitions

// Ensure you have OPENAI_API_KEY set in your Vercel project's environment variables
const API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
});

// Helper function to call our new fetchImage API endpoint
// Note: This assumes the Vercel app is deployed and accessible via its domain.
// For local development, this needs to point to the local dev server (e.g., http://localhost:3000/api/fetchImage).
// We will use a relative path for Vercel deployment.
async function getUnsplashImageUrl(searchQuery: string, deploymentUrl: string): Promise<string | null> {
  // In Vercel, process.env.VERCEL_URL gives the deployment URL (without https://)
  // For local, you might need a different base or pass the full URL
  const baseUrl = deploymentUrl.startsWith('localhost') ? `http://${deploymentUrl}` : `https://${deploymentUrl}`;
  const fetchUrl = `${baseUrl}/api/fetchImage?query=${encodeURIComponent(searchQuery)}`;
  
  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // try to get error details
      console.error(`Error fetching image for query '${searchQuery}' from ${fetchUrl}: ${response.status}`, errorData);
      return null; // Or a default placeholder
    }
    const data = await response.json();
    return data.imageUrl; // Expecting { imageUrl: '...' }
  } catch (error) {
    console.error(`Network or parsing error fetching image for '${searchQuery}' from ${fetchUrl}:`, error);
    return null; // Or a default placeholder
  }
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }

  if (!API_KEY) {
    console.error("OpenAI API Key not configured on server.");
    return response.status(500).json({ error: "API Key for OpenAI is not configured on the server." });
  }

  const preferences = request.body as UserPreferences;

  if (!preferences) {
    return response.status(400).json({ error: "User preferences not provided in request body." });
  }

  const model = 'gpt-4o-mini';
  const isSurprise = preferences.holidayType === 'SURPRISE_ME';

  let promptContent = `
You are a highly discerning and experienced travel advisor, known for unearthing hidden gems and perfectly tailored niche experiences. Your primary goal is to provide 6 TRULY DIVERSE, INTRIGUING, and NON-OBVIOUS travel destinations. Actively AVOID clichés, common tourist traps, or overly similar suggestions. Challenge yourself to find genuinely unique options. If a user's request is broad, ensure a wide variety of experiences and locations.`;

  if (isSurprise) {
    promptContent += `

**SURPRISE ME MODE ACTIVATED!**
The user wants you to be exceptionally creative and suggest highly diverse and unexpected destinations. They have *only* specified their budget and travel companions. For all other criteria (holiday type, climate, interests, duration, travel month), you have complete freedom. Aim for a mix of truly unique and varied experiences that fit the budget and companion type. Do not ask for more preferences; embrace the surprise! Your suggestions should be particularly imaginative in this mode.`;
  }

  promptContent += `

For the chosen travel month (${isSurprise ? 'you pick what makes sense for a surprise suggestion and the destination, or assume general best travel times if no specific month enhances the surprise' : (preferences.travelMonth || 'Any')}):
- Briefly explain how the month might enhance or affect the experience (e.g., local festivals, seasonal beauty, fewer crowds, specific weather patterns). This is especially important if you are picking the month in Surprise Me mode to justify your choice.
- Ensure your suggestions are seasonally appropriate if a month is specified (or you pick one for surprise mode).

For each destination, provide:
1.  "name": The name of the destination.
2.  "description": A compelling, evocative description (CONCISE: 1-2 sentences), highlighting what makes it unique and intriguing for THIS user (or for a surprise).
3.  "matchReason": A concise, single-sentence explanation of why this specific destination is an accurate and *particularly insightful or niche* match for the user's exact preferences (or why it's a great surprise given budget/companions). Justify its uniqueness.
4.  "detailedReasoning": More in-depth valuable comments (CONCISE: 1-2 sentences). Clearly articulate how unique features of the destination directly address MULTIPLE user preferences (or the surprise criteria) and why it stands out as a recommendation. If it's an "off-the-beaten-path" suggestion, briefly explain what makes it so.
5.  "suitability": A qualitative assessment. For surprise mode, use terms like "Exciting Surprise!", "Unexpected Gem!", "Bold Adventure!". For normal mode, use terms like "Perfect Niche Pick", "Unique Cultural Gem", "Offbeat Adventure", "Exceptional Fit", "Hidden Beauty".
6.  "imageSearchQuery": CRITICAL FOR IMAGE QUALITY. Provide a concise (2-4 keywords) but *highly effective and evocative* search query for Unsplash. Think like a photographer. Include terms that suggest beauty, iconic views, or the essence of the location (e.g., "[Destination Name] iconic view travel", "[Destination Name] serene landscape", "[Destination Name] vibrant culture"). Prioritize queries likely to yield high-quality, professional-looking travel photography.
7.  "imageUrl": Set this to an empty string (""). It will be populated by a different service later.
8.  "nearestAirports": A string listing 1-3 major international or well-connected regional airports, including their IATA codes.
9.  "mustDoActivities": An array of 2-3 short strings, each describing a key highlight or must-do activity/experience.

User Preferences:
- Budget: ${preferences.budget}
- Travel Companions: ${preferences.companions}`;

  if (!isSurprise) {
    promptContent += `
- Holiday Type: ${preferences.holidayType}
- Preferred Climate: ${preferences.climate}
- Interests/Activities: ${preferences.interests || "Not specified, focus on primary preferences"}
- Trip Duration: ${preferences.duration}
- Preferred Travel Month: ${preferences.travelMonth || 'Any'}`;
  } else {
    promptContent += `
- Other Preferences: You are to creatively determine these to provide diverse and surprising suggestions based *only* on the budget and companions provided. Ensure suggestions are genuinely varied.`;
  }

  promptContent += `

Return your response as a valid JSON array of 6 objects. Each object must represent a destination and strictly follow this structure:
{
  "name": "string",
  "description": "string",
  "matchReason": "string",
  "detailedReasoning": "string",
  "suitability": "string",
  "imageSearchQuery": "string",
  "imageUrl": "",
  "nearestAirports": "string",
  "mustDoActivities": ["string", "string", "string"]
}

CRITICAL INSTRUCTIONS:
- The response MUST be ONLY the JSON array string.
- The JSON must be well-formed, complete, and directly usable.
- Generate ALL 6 distinct and unique suggestions.
- Accuracy, specificity, and insightful reasoning are paramount.
- For "SURPRISE ME MODE", ensure the suggestions are genuinely surprising and diverse, not just random. They should still feel curated and thoughtful, even if unexpected.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: promptContent }],
      response_format: { type: "json_object" },
      temperature: isSurprise ? 0.95 : 0.9, // Slightly higher temp for surprise me
    });

    const jsonText = completion.choices[0]?.message?.content?.trim();

    if (!jsonText) {
      console.error("OpenAI response content is empty or undefined. Full completion:", completion);
      return response.status(500).json({ error: "The AI returned an empty response." });
    }

    let parsedData;
    try {
      const rawParsed = JSON.parse(jsonText);
      if (typeof rawParsed === 'object' && rawParsed !== null && !Array.isArray(rawParsed)) {
        const keys = Object.keys(rawParsed);
        if (keys.length === 1 && Array.isArray(rawParsed[keys[0]])) {
          parsedData = rawParsed[keys[0]];
        } else {
          console.error("Parsed JSON is an object but not the expected array wrapper:", rawParsed);
          return response.status(500).json({ error: "The AI returned data in an unexpected object format." });
        }
      } else if (Array.isArray(rawParsed)) {
        parsedData = rawParsed;
      } else {
        console.error("Parsed JSON is not an array or the expected wrapper object:", rawParsed);
        return response.status(500).json({ error: "The AI returned data that is not a JSON array." });
      }

      if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData.every(item =>
        typeof item.name === 'string' &&
        typeof item.description === 'string' &&
        typeof item.matchReason === 'string' &&
        typeof item.detailedReasoning === 'string' &&
        typeof item.suitability === 'string' &&
        typeof item.imageSearchQuery === 'string' &&
        typeof item.imageUrl === 'string' &&
        typeof item.nearestAirports === 'string' &&
        (Array.isArray(item.mustDoActivities) && item.mustDoActivities.every((activity: any) => typeof activity === 'string'))
      )) {
        
        // Determine the deployment URL for internal API calls
        const host = request.headers['x-forwarded-host'] || request.headers['host'];
        const deploymentUrl = host || process.env.VERCEL_URL || 'localhost:3000'; // Fallback for local

        const suggestionsWithRealImages = await Promise.all(
          parsedData.map(async (item: any) => {
            let imageUrl = item.imageUrl; // Start with AI-provided (Picsum) placeholder
            if (item.imageSearchQuery) {
              const unsplashUrl = await getUnsplashImageUrl(item.imageSearchQuery, deploymentUrl as string);
              if (unsplashUrl) {
                imageUrl = unsplashUrl;
              }
            }
            const destinationNameEncoded = encodeURIComponent(item.name);
            return {
              ...item,
              imageUrl: imageUrl, // Now updated with Unsplash URL if successful
              googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${destinationNameEncoded}`,
              tripAdvisorUrl: `https://www.tripadvisor.com/Search?q=${destinationNameEncoded}`
            } as DestinationSuggestion;
          })
        );
        return response.status(200).json(suggestionsWithRealImages);
      }
      console.error("Parsed JSON is not an array of the expected DestinationSuggestion structure or is empty:", parsedData);
      const finishReason = completion.choices[0]?.finish_reason;
      if (finishReason === "length") {
        return response.status(500).json({ error: "The AI's response was too long and got cut off." });
      }
      return response.status(500).json({ error: "The AI returned data in an unexpected format." });

    } catch (parseError) {
      console.error("Failed to parse JSON response from OpenAI:", parseError, "Raw text:", jsonText.substring(0, 500));
      return response.status(500).json({ error: "The AI returned an invalid JSON format." });
    }

  } catch (error: any) {
    console.error("Error interacting with OpenAI API:", error);
    let specificMessage = "Failed to get travel suggestions. Please try again.";
    if (error instanceof OpenAI.APIError) {
      specificMessage = `OpenAI API Error (${error.status}): ${error.message}`;
      if (error.code) {
        if (error.code === 'invalid_api_key') {
            specificMessage = "The OpenAI API Key on the server is invalid or missing.";
        } else if (error.code === 'insufficient_quota') {
            specificMessage = "OpenAI API quota exceeded on the server.";
        }
      }
    } else if (error.message) {
        specificMessage = error.message;
    }
    return response.status(500).json({ error: specificMessage });
  }
} 