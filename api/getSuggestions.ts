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
}
// End of duplicated type definitions

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
You are an expert travel advisor. Your primary goal is to provide 5 EXTREMELY DIVERSE and UNIQUE travel destinations based on the user's preferences. Actively avoid common or overly similar suggestions. Challenge yourself to find truly distinct options, considering different continents, cultures, and activity types where appropriate, even if preferences are narrow.

Consider the typical weather and events for the specified travel month if provided. If "Any" month is selected, use general suitability based on typical best times to visit considering the other preferences. Emphasize how the chosen month impacts the experience (e.g., festivals, seasonal activities, weather advantages/disadvantages).

For each destination, provide:
1.  "name": The name of the destination (e.g., "Paris, France", "Kyoto, Japan").
2.  "description": A compelling, brief description of the destination (2-3 sentences), highlighting what makes it unique.
3.  "matchReason": A concise, single-sentence explanation of why this specific destination is an accurate and *unique* initial match for the user's exact preferences. Be specific about the differentiating factors.
4.  "detailedReasoning": More in-depth valuable comments (2-3 sentences) explaining specific aspects that make it a great choice. Clearly articulate how unique features of the destination directly address MULTIPLE user preferences. Avoid generic statements. Reinforce the uniqueness.
5.  "suitability": A qualitative assessment (e.g., "Excellent Unique Match", "Strong Offbeat Contender", "Hidden Gem Choice").
6.  "imageSearchQuery": A highly specific string of 3-5 keywords for finding iconic and representative images of THIS EXACT destination on Google Images. Focus on recognizable landmarks, activities, or natural features (e.g., "Eiffel Tower night illumination Paris", "Arashiyama Bamboo Grove Kyoto sunny day", "Serengeti Great Migration safari jeep"). These keywords will also be used to try and generate a more relevant Picsum URL, so make them descriptive.
7.  "imageUrl": A placeholder image URL. Generate this using Picsum Photos, but make the seed VERY SPECIFIC using a slug derived from the imageSearchQuery. Format: "https://picsum.photos/seed/SLUG_FROM_IMAGE_SEARCH_QUERY/600/400". For example, if imageSearchQuery is "Eiffel Tower night Paris", the slug could be "eiffel-tower-night-paris".
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
  "imageSearchQuery": "string",
  "imageUrl": "string", 
  "nearestAirports": "string"
}

CRITICAL INSTRUCTIONS:
- The response MUST be ONLY the JSON array string. No text, comments, or markdown before or after it.
- The JSON must be well-formed, complete, and directly usable. All strings must be properly escaped.
- Generate ALL 5 distinct and unique suggestions. Do not repeat destinations or offer overly similar options. Prioritize variety above all else, while still matching preferences.
- Ensure the entire JSON response, including all 5 objects and all closing brackets and commas, is provided without any truncation or malformation.
- Accuracy and specificity in reasoning and keywords are paramount.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.85, // Increased temperature slightly for more diverse suggestions
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
        typeof item.nearestAirports === 'string'
      )) {
        const suggestionsWithFullUrls = parsedData.map((item: any) => {
          const destinationNameEncoded = encodeURIComponent(item.name);
          // Generate slug from the more specific imageSearchQuery for Picsum
          const picsumSlug = generateSlug(item.imageSearchQuery || item.name); 
          return {
            ...item,
            imageUrl: `https://picsum.photos/seed/${picsumSlug}/600/400`,
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