import OpenAI from 'openai';
import { UserPreferences, DestinationSuggestion } from '../types';

const API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side usage
});

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export const getTravelSuggestions = async (preferences: UserPreferences): Promise<DestinationSuggestion[]> => {
  if (!API_KEY) {
    throw new Error("API Key for OpenAI is not configured. Please set the OPENAI_API_KEY environment variable.");
  }

  const model = 'gpt-4o-mini'; // Using the specified gpt-4o-mini model

  const prompt = `
You are an expert travel advisor. Based on the following user preferences, suggest 5 DIVERSE and DISTINCT travel destinations.
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
7.  "nearestAirports": A string listing 1-3 major international or well-connected regional airports, including their IATA codes (e.g., "Paris Charles de Gaulle (CDG), Paris Orly (ORY)", "Tokyo Narita (NRT), Tokyo Haneda (HND)").

User Preferences:
- Holiday Type: ${preferences.holidayType}
- Budget: ${preferences.budget}
- Travel Companions: ${preferences.companions}
- Preferred Climate: ${preferences.climate}
- Interests/Activities: ${preferences.interests || "Not specified, focus on primary preferences"}
- Trip Duration: ${preferences.duration}

Return your response as a valid JSON array of 5 objects. Each object must represent a destination and strictly follow this structure:
{
  "name": "string",
  "description": "string",
  "matchReason": "string",
  "detailedReasoning": "string",
  "suitability": "string",
  "imageUrl": "string",
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
      response_format: { type: "json_object" }, // Request JSON output
      temperature: 0.7, // Adjusted for a balance of creativity and consistency
    });

    const jsonText = completion.choices[0]?.message?.content?.trim();

    if (!jsonText) {
      console.error("OpenAI response content is empty or undefined. Full completion:", completion);
      throw new Error("The AI returned an empty response. Please try again.");
    }
    
    // OpenAI with json_object mode should return a string that is already a valid JSON object.
    // However, the prompt asks for a JSON *array* string.
    // If the model wraps the array in an object like {"suggestions": [...]}, we need to extract it.
    // Or, if it directly returns the array string, we parse that.

    let parsedData;
    try {
      const rawParsed = JSON.parse(jsonText);
      // Check if the response is an object with a single key containing the array
      // (e.g. { "destinations": [...] } or { "suggestions": [...] } )
      if (typeof rawParsed === 'object' && rawParsed !== null && !Array.isArray(rawParsed)) {
        const keys = Object.keys(rawParsed);
        if (keys.length === 1 && Array.isArray(rawParsed[keys[0]])) {
          parsedData = rawParsed[keys[0]];
        } else {
          // If it's an object but not the expected wrapper, it might be a single suggestion (not an array)
          // or a malformed structure. For now, we expect an array.
          console.error("Parsed JSON is an object but not the expected array wrapper:", rawParsed);
          throw new Error("The AI returned data in an unexpected object format. Expected an array of suggestions.");
        }
      } else if (Array.isArray(rawParsed)) {
        parsedData = rawParsed;
      } else {
        console.error("Parsed JSON is not an array or the expected wrapper object:", rawParsed);
        throw new Error("The AI returned data that is not a JSON array or a recognizable wrapper object.");
      }

      if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData.every(item =>
        typeof item.name === 'string' &&
        typeof item.description === 'string' &&
        typeof item.matchReason === 'string' &&
        typeof item.detailedReasoning === 'string' &&
        typeof item.suitability === 'string' &&
        typeof item.imageUrl === 'string' && // This will be generated based on name
        typeof item.nearestAirports === 'string'
      )) {
        return parsedData.map((item: any) => {
          const destinationNameEncoded = encodeURIComponent(item.name);
          return {
            ...item,
            imageUrl: `https://picsum.photos/seed/${generateSlug(item.name)}/600/400`, // Ensure slug is used
            googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${destinationNameEncoded}`,
            tripAdvisorUrl: `https://www.tripadvisor.com/Search?q=${destinationNameEncoded}`
          } as DestinationSuggestion;
        });
      }
      console.error("Parsed JSON is not an array of the expected DestinationSuggestion structure or is empty:", parsedData);
      // Add more detailed error logging based on completion if available
      const finishReason = completion.choices[0]?.finish_reason;
      if (finishReason === "length") {
        throw new Error("The AI's response was too long (max_tokens) and got cut off before completing the JSON structure. Try simplifying your interests or request.");
      }
      throw new Error("The AI returned data in an unexpected format. The response was: " + jsonText.substring(0, 500) + (jsonText.length > 500 ? "..." : ""));

    } catch (parseError) {
      console.error("Failed to parse JSON response from OpenAI:", parseError, "Raw text (first 500 chars):", jsonText.substring(0, 500) + (jsonText.length > 500 ? "..." : ""));
      const finishReason = completion.choices[0]?.finish_reason;
      if (finishReason === "length") {
        throw new Error("The AI's response was too long and got cut off, resulting in incomplete JSON. Try simplifying your interests or request.");
      }
      // TODO: Add more specific error handling based on OpenAI error types if possible
      throw new Error("The AI returned an invalid suggestion format (JSON could not be parsed). Please try rephrasing your interests or try again.");
    }

  } catch (error) {
    console.error("Error interacting with OpenAI API:", error);
    let specificMessage = "Failed to get travel suggestions. Please try again.";
    if (error instanceof OpenAI.APIError) {
      specificMessage = `OpenAI API Error (${error.status}): ${error.message}`;
      if (error.code) {
         // e.g. "invalid_api_key", "insufficient_quota"
        if (error.code === 'invalid_api_key') {
            specificMessage = "The provided OpenAI API Key is invalid or missing. Please ensure it is correctly configured in .env.local and rebuilt the app if necessary.";
        } else if (error.code === 'insufficient_quota') {
            specificMessage = "You have exceeded your OpenAI API quota. Please check your OpenAI account limits and billing.";
        }
      }
    } else if (error instanceof Error) {
        // Catch errors from the new Error() throws above
        specificMessage = error.message;
    }
    
    throw new Error(specificMessage);
  }
}; 