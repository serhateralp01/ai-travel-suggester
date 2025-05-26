
import { SelectOption } from './src/types';

export const HOLIDAY_TYPES: SelectOption[] = [
  { value: "Relaxation", label: "Relaxation (e.g., beach, spa)" },
  { value: "Adventure", label: "Adventure (e.g., hiking, water sports)" },
  { value: "City Break", label: "City Break (e.g., exploring urban centers)" },
  { value: "Cultural", label: "Cultural (e.g., historical sites, museums)" },
  { value: "Historical Journey", label: "Historical Journey (e.g., ancient ruins, heritage tours)" },
  { value: "Nature Retreat", label: "Nature Retreat (e.g., mountains, forests)" },
  { value: "Foodie Trip", label: "Foodie Trip (e.g., culinary exploration)" },
  { value: "Road Trip", label: "Road Trip (e.g., scenic drives, multiple stops)" },
  { value: "Wellness & Spa", label: "Wellness & Spa (e.g., yoga retreats, health resorts)" },
  { value: "Luxury Escape", label: "Luxury Escape (e.g., high-end resorts, exclusive experiences)" },
];

export const BUDGET_OPTIONS: SelectOption[] = [
  { value: "Ultra-Budget", label: "Ultra-Budget (e.g., Hostels, Camping)" },
  { value: "Budget-Conscious", label: "Budget-Conscious (Value focused)" },
  { value: "Mid-Range", label: "Comfortable Mid-Range ($$)" },
  { value: "Premium", label: "Premium Indulgence ($$$)" },
  { value: "Ultra-Luxury", label: "Ultra-Luxury (Exclusive, $$$$)" },
];

export const COMPANION_OPTIONS: SelectOption[] = [
  { value: "Solo", label: "Solo" },
  { value: "Couple", label: "Couple" },
  { value: "Couple (Romantic Getaway)", label: "Couple (Romantic Getaway)" },
  { value: "Family with Kids", label: "Family with Young Kids" },
  { value: "Family with Teenagers", label: "Family with Teenagers" },
  { value: "Multi-Generational Group", label: "Multi-Generational Family/Group" },
  { value: "Group of Friends", label: "Group of Friends" },
];

export const CLIMATE_OPTIONS: SelectOption[] = [
  { value: "Warm/Sunny", label: "Warm / Sunny" },
  { value: "Tropical (Hot & Humid)", label: "Tropical (Hot & Humid)" },
  { value: "Desert (Hot & Dry)", label: "Desert (Hot & Dry)" },
  { value: "Mediterranean", label: "Mediterranean (Warm Summers, Mild Winters)" },
  { value: "Mild/Temperate", label: "Mild / Temperate (Four Seasons)" },
  { value: "Cool/Crisp", label: "Cool / Crisp Autumn/Spring" },
  { value: "Snowy/Cold", label: "Snowy / Cold Winter" },
];

export const DURATION_OPTIONS: SelectOption[] = [
  { value: "Micro-Trip (1-2 days)", label: "Micro-Trip (1-2 days)" },
  { value: "Short Weekend (2-3 days)", label: "Short Weekend (2-3 days)" },
  { value: "Long Weekend (3-5 days)", label: "Long Weekend (3-5 days)" },
  { value: "Approx. 1 Week (5-8 days)", label: "Approx. 1 Week (5-8 days)" },
  { value: "Approx. 2 Weeks (10-15 days)", label: "Approx. 2 Weeks (10-15 days)" },
  { value: "Extended Trip (3+ Weeks)", label: "Extended Trip (3+ Weeks)" },
];

export const DEFAULT_PREFERENCES = {
  holidayType: HOLIDAY_TYPES[0].value,
  budget: BUDGET_OPTIONS[1].value, // Budget-Conscious
  companions: COMPANION_OPTIONS[0].value, // Solo
  climate: CLIMATE_OPTIONS[0].value, // Warm/Sunny
  interests: "",
  duration: DURATION_OPTIONS[3].value, // Approx. 1 Week (5-8 days)
};