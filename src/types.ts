export interface UserPreferences {
  holidayType: string;
  budget: string;
  companions: string;
  climate: string;
  interests: string;
  duration: string;
  travelMonth?: string; // Optional: e.g., "January", "Any"
}

export interface DestinationSuggestion {
  name: string;
  description: string;
  matchReason: string; // A concise summary
  detailedReasoning: string; // More in-depth valuable comments
  suitability: string; // e.g., "Excellent Match", "Strong Contender"
  imageUrl: string; // This will be the Picsum URL for now
  imageSearchQuery?: string; // Keywords for a more specific image search by the user
  googleMapsUrl: string;
  tripAdvisorUrl: string;
  nearestAirports: string; // e.g., "London Heathrow (LHR), London Gatwick (LGW)"
}

export interface SelectOption {
  value: string;
  label: string;
}