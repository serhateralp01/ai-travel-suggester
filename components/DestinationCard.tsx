
import React from 'react';
import { DestinationSuggestion } from '../types';
import { AirportIcon } from './icons/AirportIcon'; // Assuming you'll create this icon

interface DestinationCardProps {
  suggestion: DestinationSuggestion;
}

const ExternalLinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1 inline-block" {...props}>
    <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h4a.75.75 0 010 1.5h-4a.75.75 0 00-.75.75z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M6.19 14.25a.75.75 0 010-1.06L14.94 4.44a.75.75 0 011.06 0l.22.22a.75.75 0 010 1.06L7.25 14.47l-.22.22a.75.75 0 01-1.06 0l-.56-.56z" clipRule="evenodd" />
  </svg>
);

// Placeholder for AirportIcon, create this file similarly to other icons
// components/icons/AirportIcon.tsx
// Example content for AirportIcon.tsx (replace with actual SVG path):
// const AirportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
//     <path d="M10.18 9"/> Path for an airport icon, e.g., a plane symbol slightly different from PlaneIcon
//   </svg>
// );


export const DestinationCard: React.FC<DestinationCardProps> = ({ suggestion }) => {
  return (
    <div className="bg-slate-800 rounded-lg shadow-xl shadow-sky-900/30 overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-sky-700/50 hover:-translate-y-1">
      <img 
        src={suggestion.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(suggestion.name)}/600/400`} 
        alt={`View of ${suggestion.name}`} 
        className="w-full h-48 object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null; 
          target.src = 'https://picsum.photos/seed/travel-fallback/600/400'; 
        }}
      />
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-2xl font-bold text-sky-400 mb-1">{suggestion.name}</h3>
        {suggestion.suitability && (
            <span className="inline-block bg-sky-600 text-sky-100 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full mb-2 self-start">
                {suggestion.suitability}
            </span>
        )}
        <p className="text-sm text-slate-300 mb-3 flex-grow">{suggestion.description}</p>
        
        <div className="space-y-3 mb-4">
            <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Match Reason:</h4>
                <p className="text-sm text-slate-300">{suggestion.matchReason}</p>
            </div>
            <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Detailed Insights:</h4>
                <p className="text-sm text-slate-300">{suggestion.detailedReasoning}</p>
            </div>
            {suggestion.nearestAirports && (
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1 flex items-center">
                  <AirportIcon className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {/* Assuming AirportIcon is created */}
                  Nearest Airports:
                </h4>
                <p className="text-sm text-slate-300">{suggestion.nearestAirports}</p>
              </div>
            )}
        </div>

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
        </div>
      </div>
    </div>
  );
};