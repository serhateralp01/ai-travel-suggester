import React, { useState } from 'react';
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

// --- Icon Definitions ---
const SuitabilityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.06 0l4.009-5.5z" clipRule="evenodd" />
  </svg>
);

const AirportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M3.5 9.564c0-1.089.49-1.991 1.237-2.608a3.501 3.501 0 014.877-4.043L14.936.59A1 1 0 0116.5 1.43l-2.3 4.601a3.5 3.5 0 01-4.23 2.92L3.5 9.564zM2.98 10.064a4.5 4.5 0 006.053 4.485l5.968 2.984a1 1 0 001.24-.22l1.468-2.446a1 1 0 00-.305-1.353l-5.968-2.984a4.501 4.501 0 00-6.131-3.653L2.98 10.064z" />
  </svg>
);

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
  </svg>
);

const ChevronUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832l-3.71 3.938a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
  </svg>
);

const RefinedExternalLinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

interface DestinationCardProps {
  suggestion: DestinationSuggestion;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ suggestion }) => {
  const [isDetailedReasoningExpanded, setIsDetailedReasoningExpanded] = useState(false);
  const googleImageSearchUrl = suggestion.imageSearchQuery 
    ? `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(suggestion.imageSearchQuery)}` 
    : `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(suggestion.name + " landscape scenery travel")}`;

  const renderListItem = (IconComponent: React.ElementType, label: string, value: string | undefined, isBadge: boolean = false) => (
    value ? (
      <div className="flex items-start text-sm mb-1.5">
        <IconComponent className="w-5 h-5 mr-2.5 text-sky-400 shrink-0 mt-0.5" />
        <span className="font-semibold text-slate-300 mr-1.5">{label}:</span>
        {isBadge ? (
          <span className="bg-sky-600/70 text-sky-200 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide">
            {value}
          </span>
        ) : (
          <span className="text-slate-400">{value}</span>
        )}
      </div>
    ) : null
  );

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-sky-600/60 ring-1 ring-slate-700/50 hover:ring-sky-500/70">
      <img 
        src={suggestion.imageUrl} 
        alt={`Scenic view of ${suggestion.name}`}
        className="w-full h-52 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" // group-hover for potential future use if card is a group
        onError={(e) => { 
          (e.target as HTMLImageElement).style.display = 'none'; 
          const placeholder = document.createElement('div');
          placeholder.className = 'w-full h-52 bg-slate-700 flex items-center justify-center text-slate-500';
          placeholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 opacity-50"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>';
          const parent = (e.target as HTMLImageElement).parentNode;
          if (parent) parent.insertBefore(placeholder, (e.target as HTMLImageElement));
        }}
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-sky-400 mb-3 tracking-tight">{suggestion.name}</h3>
        
        <div className="mb-4 border-b border-slate-700 pb-3">
          {renderListItem(SuitabilityIcon, "Suitability", suggestion.suitability, true)}
          {renderListItem(AirportIcon, "Airports", suggestion.nearestAirports)}
        </div>

        <p className="text-slate-300 text-sm mb-3 leading-relaxed">{suggestion.description}</p>
        
        {suggestion.matchReason && (
            <p className="text-xs text-slate-400 mb-4 italic bg-slate-700/40 p-2.5 rounded-md">
                <span className="font-semibold not-italic text-sky-400/80">Match Insight:</span> {suggestion.matchReason}
            </p>
        )}
        
        {suggestion.detailedReasoning && (
          <div className="mb-4">
            <div className={`text-sm text-slate-300 overflow-hidden transition-all duration-300 ease-in-out ${isDetailedReasoningExpanded ? 'max-h-96' : 'max-h-16 line-clamp-3'}`}>
              {suggestion.detailedReasoning}
            </div>
            {suggestion.detailedReasoning.length > 120 && ( // Adjusted length threshold for toggle
              <button 
                onClick={() => setIsDetailedReasoningExpanded(!isDetailedReasoningExpanded)}
                className="text-xs text-sky-400 hover:text-sky-300 mt-2 flex items-center font-medium group"
              >
                {isDetailedReasoningExpanded ? 'Read Less' : 'Read More'}
                {isDetailedReasoningExpanded ? 
                  <ChevronUpIcon className="w-4 h-4 ml-1 group-hover:translate-y-[-1px] transition-transform" /> : 
                  <ChevronDownIcon className="w-4 h-4 ml-1 group-hover:translate-y-[1px] transition-transform" />}
              </button>
            )}
          </div>
        )}

        <div className="mt-auto pt-5 border-t border-slate-700 space-y-2.5">
          {[ { href: suggestion.googleMapsUrl, label: "View on Google Maps" },
             { href: suggestion.tripAdvisorUrl, label: "Explore on TripAdvisor" },
             { href: googleImageSearchUrl, label: "Find Images on Google" }
          ].map(link => (
            <a 
              key={link.label}
              href={link.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-sky-400 hover:text-sky-300 transition-colors duration-150 ease-in-out flex items-center group"
              aria-label={link.label}
            >
              {link.label} <RefinedExternalLinkIcon className="w-4 h-4 ml-1.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};