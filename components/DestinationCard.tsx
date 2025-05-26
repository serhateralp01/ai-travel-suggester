import React from 'react';
import { DestinationSuggestion } from '../src/types';
// import { ExternalLinkIcon } from './icons/ExternalLinkIcon'; // We will define a simple one here
// import { MapPinIcon, GlobeAltIcon, BuildingLibraryIcon } from './icons/SuggestionCardIcons'; // Placeholder for now

// Simple ExternalLinkIcon definition (can be moved to a separate file later)
const ExternalLinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1 inline-block" {...props}>
    <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h4a.75.75 0 010 1.5h-4a.75.75 0 00-.75.75z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M6.19 14.25a.75.75 0 010-1.06L14.94 4.44a.75.75 0 011.06 0l.22.22a.75.75 0 010 1.06L7.25 14.47l-.22.22a.75.75 0 01-1.06 0l-.56-.56z" clipRule="evenodd" />
  </svg>
);

// Placeholder for SuggestionCardIcons - create these in components/icons/SuggestionCardIcons.tsx
const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>; // Example simple path
const BuildingLibraryIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props}><path d="M4 6H2v14h2V6zm3 0H5v14h2V6zm3 0H8v14h2V6zm3 0h-2v14h2V6zm3 0h-2v14h2V6zm3 0h-2v14h2V6zm3 0h-2v14h2V6zM1 22h22v-2H1v2zM12 2L2 7v2h20V7L12 2z"/></svg>; // Example simple path

interface DestinationCardProps {
  suggestion: DestinationSuggestion;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ suggestion }) => {
  const googleImageSearchUrl = suggestion.imageSearchQuery 
    ? `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(suggestion.imageSearchQuery)}` 
    : `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(suggestion.name + " landscape scenery travel")}`;

  return (
    <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-sky-700/50 hover:scale-[1.02]">
      <img 
        src={suggestion.imageUrl} 
        alt={`Scenic view of ${suggestion.name}`}
        className="w-full h-48 object-cover" 
        onError={(e) => { 
          // Fallback if Picsum image fails, or just to hide broken image icon
          (e.target as HTMLImageElement).style.display = 'none'; 
          // Optionally, replace with a placeholder div or icon
          const placeholder = document.createElement('div');
          placeholder.className = 'w-full h-48 bg-slate-700 flex items-center justify-center text-slate-500';
          placeholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>';
          (e.target as HTMLImageElement).parentNode?.insertBefore(placeholder, (e.target as HTMLImageElement));
        }}
      />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-sky-400 mb-2">{suggestion.name}</h3>
        
        <div className="mb-3 space-y-1 text-sm text-slate-300">
            <p className="flex items-start"><BuildingLibraryIcon className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-sky-500" /> <strong>Suitability:</strong> {suggestion.suitability}</p>
            <p className="flex items-start"><MapPinIcon className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-sky-500" /> <strong>Airports:</strong> {suggestion.nearestAirports}</p>
        </div>

        <p className="text-slate-400 text-sm mb-2 flex-grow leading-relaxed">{suggestion.description}</p>
        <p className="text-xs text-slate-500 mb-3 italic"><strong>Match Reason:</strong> {suggestion.matchReason}</p>
        <p className="text-sm text-slate-300 bg-slate-700/50 p-3 rounded-md mb-4">{suggestion.detailedReasoning}</p>

        <div className="mt-auto pt-4 border-t border-slate-700 space-y-2">
            <a 
              href={suggestion.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-sky-400 hover:text-sky-300 hover:underline transition-colors duration-150 ease-in-out flex items-center"
              aria-label={`View ${suggestion.name} on Google Maps`}
            >
              View on Google Maps <ExternalLinkIcon />
            </a>
            <a 
              href={suggestion.tripAdvisorUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-sky-400 hover:text-sky-300 hover:underline transition-colors duration-150 ease-in-out flex items-center"
              aria-label={`Search for ${suggestion.name} on TripAdvisor`}
            >
              Explore on TripAdvisor <ExternalLinkIcon />
            </a>
            <a 
              href={googleImageSearchUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-sky-400 hover:text-sky-300 hover:underline transition-colors duration-150 ease-in-out flex items-center"
              aria-label={`Search for images of ${suggestion.name}`}
            >
              Find Images on Google <ExternalLinkIcon />
            </a>
        </div>
      </div>
    </div>
  );
};