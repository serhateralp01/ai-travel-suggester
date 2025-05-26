import { UserPreferences, DestinationSuggestion } from '../src/types';

export const getTravelSuggestions = async (preferences: UserPreferences): Promise<DestinationSuggestion[]> => {
  try {
    const response = await fetch('/api/getSuggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const suggestions: DestinationSuggestion[] = await response.json();
    return suggestions;

  } catch (error) {
    console.error("Error fetching travel suggestions:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to get travel suggestions. Please check your internet connection and try again.");
  }
}; 