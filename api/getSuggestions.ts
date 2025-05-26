import OpenAI from 'openai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { UserPreferences, DestinationSuggestion } from '../src/types';

// Ensure you have OPENAI_API_KEY set in your Vercel project's environment variables
const API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
});

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
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

  const prompt = `
You are an expert travel advisor. Based on the following user preferences, suggest 5 DIVERSE and DISTINCT travel destinations.
Consider the typical weather and events for the specified travel month if provided. If "Any" month is selected, use general suitability based on typical best times to visit considering the other preferences.
It is crucial that each suggestion is unique and offers a different type of experience or geographical focus, even if some core preferences overlap.
Aim for a global spread where appropriate, including Europe, Asia, the Americas, Africa, and Oceania.
Challenge yourself to include at least one or two "off-the-beaten-path" or less obvious options that are still highly relevant and accurate matches.
Deeply interpret the combination of user preferences to find destinations that truly shine for that specific mix.

For each destination, provide:
1.  "name": The name of the destination (e.g., "Paris, France", "Kyoto, Japan").
2.  "description": A compelling, brief description of the destination (2-3 sentences).
3.  "matchReason": A concise, single-sentence explanation of why this specific destination is an accurate initial match for the user's exact preferences. Be specific.
4.  "detailedReasoning": More in-depth valuable comments (2-3 sentences) explaining specific aspects that make it a great choice. Clearly articulate how unique features of the destination directly address MULTIPLE user preferences. Avoid generic statements.
5.  "suitability": A qualitative assessment of how well the destination matches (e.g., "Excellent Match", "Strong Contender", "Unique Gem", "Good Alternative").
6.  "imageUrl": A placeholder image URL using Picsum Photos. Format it as "https://picsum.photos/seed/DESTINATION_NAME_SLUG/600/400", where DESTINATION_NAME_SLUG is a URL-friendly version of the destination name (e.g., for "Bali, Indonesia", use "bali-indonesia").
7.  "imageSearchQuery": A short string of 2-4 ideal keywords for finding representative images of this destination on Google Images (e.g., "Eiffel Tower Paris night", "Kyoto Arashiyama bamboo forest").
8.  "nearestAirports": A string listing 1-3 major international or well-connected regional airports, including their IATA codes (e.g., "Paris Charles de Gaulle (CDG), Paris Orly (ORY)", "Tokyo Narita (NRT), Tokyo Haneda (HND)").

User Preferences:
- Holiday Type: ${preferences.holidayType}
- Budget: ${preferences.budget}
- Travel Companions: ${preferences.companions}
- Preferred Climate: ${preferences.climate}
- Interests/Activities: ${preferences.interests || "Not specified, focus on primary preferences"}
- Trip Duration: ${preferences.duration}
- Preferred Travel Month: ${preferences.travelMonth || 'Any'}

Return your response as a valid JSON array of 5 objects. Each object must represent a destination and strictly follow this structure:
{
  "name": "string",
  "description": "string",
  "matchReason": "string",
  "detailedReasoning": "string",
  "suitability": "string",
  "imageUrl": "string",
  "imageSearchQuery": "string",
  "nearestAirports": "string"
}

CRITICAL INSTRUCTIONS:
- The response MUST be ONLY the JSON array string. No text, comments, or markdown before or after it.
- The JSON must be well-formed, complete, and directly usable. All strings must be properly escaped.
- Generate ALL 5 distinct suggestions. Do not repeat destinations or offer overly similar options.
- Ensure the entire JSON response, including all 5 objects and all closing brackets and commas, is provided without any truncation or malformation.
- Accuracy and specificity in reasoning are paramount.
Example for imageUrl: if name is "Kyoto, Japan", imageUrl should be "https://picsum.photos/seed/kyoto-japan/600/400".
The "detailedReasoning" should provide genuine, specific insights. The "suitability" should reflect a thoughtful assessment.
The "nearestAirports" should be practical for travelers.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
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
        typeof item.imageUrl === 'string' &&
        typeof item.imageSearchQuery === 'string' &&
        typeof item.nearestAirports === 'string'
      )) {
        const suggestionsWithFullUrls = parsedData.map((item: any) => {
          const destinationNameEncoded = encodeURIComponent(item.name);
          return {
            ...item,
            imageUrl: `https://picsum.photos/seed/${generateSlug(item.name)}/600/400`,
            imageSearchQuery: item.imageSearchQuery,
            googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${destinationNameEncoded}`,
            tripAdvisorUrl: `https://www.tripadvisor.com/Search?q=${destinationNameEncoded}`
          } as DestinationSuggestion;
        });
        return response.status(200).json(suggestionsWithFullUrls);
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