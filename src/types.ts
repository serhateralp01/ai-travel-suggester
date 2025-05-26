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
  id?: string; // Client-side ID for UI purposes
  name: string;
  description: string;
  matchReason: string; // A concise summary
  detailedReasoning: string; // More in-depth valuable comments
  suitability: string; // e.g., "Excellent Match", "Strong Contender"
  googleMapsUrl: string;
  tripAdvisorUrl: string;
  nearestAirports: string; // e.g., "London Heathrow (LHR), London Gatwick (LGW)"
  mustDoActivities?: string[]; // New field
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SavedSearch {
  id: string; // Unique ID, e.g., timestamp or UUID
  name: string; // User-defined name or auto-generated based on prefs
  preferences: UserPreferences;
  createdAt: string; // ISO date string
}