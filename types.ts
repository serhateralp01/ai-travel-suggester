
export interface UserPreferences {
  holidayType: string;
  budget: string;
  companions: string;
  climate: string;
  interests: string;
  duration: string;
}

export interface DestinationSuggestion {
  name: string;
  description: string;
  matchReason: string; // A concise summary
  detailedReasoning: string; // More in-depth valuable comments
  suitability: string; // e.g., "Excellent Match", "Strong Contender"
  imageUrl: string;
  googleMapsUrl: string;
  tripAdvisorUrl: string;
  nearestAirports: string; // e.g., "London Heathrow (LHR), London Gatwick (LGW)"
}

export interface SelectOption {
  value: string;
  label: string;
}