import React, { useState } from 'react';
import { DestinationSuggestion } from '../src/types';
// import { BlurHashImage } from './BlurHashImage'; // Import the new component
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
const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a5 5 0 00-5 5c0 4.18 5 9.5 5 9.5s5-5.32 5-9.5a5 5 0 00-5-5zm0 7.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>;
const BuildingLibraryIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props}><path d="M4 6H2v14h2V6zm3 0H5v14h2V6zm3 0H8v14h2V6zm3 0h-2v14h2V6zm3 0h-2v14h2V6zm3 0h-2v14h2V6zm3 0h-2v14h2V6zM1 22h22v-2H1v2zM12 2L2 7v2h20V7L12 2z"/></svg>; // Example simple path

// --- Icon Definitions ---
const SuitabilityIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.06 0l4.009-5.5z" clipRule="evenodd" /></svg>;
const AirportIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="currentColor" viewBox="0 0 20 20"><path d="M18.587 8.32l-5.731-2.651A3.502 3.502 0 008.303.88L3.09 3.135a1 1 0 00-.675 1.244l1.868 4.024a3.501 3.501 0 006.465 1.222l6.25-2.89a1 1 0 00.286-1.511zM3.668 11.003a4.502 4.502 0 006.174 3.846l4.855 2.246a1 1 0 001.33-.33l1.075-1.976a1 1 0 00-.424-1.325l-4.855-2.246a4.502 4.502 0 00-5.84-3.388l-2.315 1.173z"/></svg>;
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>;
const ChevronUpIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832l-3.71 3.938a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" /></svg>;
const RefinedExternalLinkIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" ><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>;
const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
const DescriptionIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 9.75A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75z" clipRule="evenodd" /></svg>; // Placeholder for description

interface DestinationCardProps {
  suggestion: DestinationSuggestion;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ suggestion, isExpanded, onToggleExpand }) => {
  const [isDetailedReasoningExpandedInternally, setIsDetailedReasoningExpandedInternally] = useState(false);
  
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

  if (!isExpanded) {
    return (
      <button
        onClick={onToggleExpand}
        aria-expanded="false"
        aria-label={`View details for ${suggestion.name}`}
        className="w-full text-left bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:bg-slate-700/90 hover:shadow-sky-600/40 ring-1 ring-slate-700/50 hover:ring-sky-500/70 flex flex-col p-5 space-y-3 group"
      >
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-sky-400 group-hover:text-sky-300 transition-colors duration-300 tracking-tight" title={suggestion.name}>{suggestion.name}</h3>
          <InfoIcon className="w-7 h-7 text-sky-500/70 group-hover:text-sky-400 group-hover:scale-105 transition-all duration-300 shrink-0" />
        </div>
        
        {suggestion.suitability && (
            <span className="inline-block bg-sky-600/60 text-sky-100 px-3 py-1 rounded-full text-sm font-medium tracking-wide group-hover:bg-sky-500/70 transition-colors duration-300 self-start">
              {suggestion.suitability}
            </span>
        )}
        <p className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors duration-300 line-clamp-3 leading-relaxed">
          {suggestion.description} 
        </p>
      </button>
    );
  }

  // EXPANDED STATE
  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-slate-700/50 animate-fadeInUp">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
            <h3 className="text-3xl font-bold text-sky-400 tracking-tight">{suggestion.name}</h3>
            <button onClick={onToggleExpand} aria-expanded="true" aria-label={`Hide details for ${suggestion.name}`} className="p-2 -mr-2 -mt-2 bg-slate-700/50 hover:bg-sky-600/70 rounded-full text-sky-300 hover:text-white transition-all duration-200">
                <ChevronUpIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="mb-4 border-b border-slate-700 pb-4">
          {renderListItem(SuitabilityIcon, "Suitability", suggestion.suitability, true)}
          {renderListItem(AirportIcon, "Airports", suggestion.nearestAirports)}
        </div>

        <div className="flex items-start text-slate-300 mb-3 leading-relaxed">
            <DescriptionIcon className="w-5 h-5 mr-2.5 text-sky-400 shrink-0 mt-1" />
            <p><span className="font-semibold text-slate-200">Description:</span> {suggestion.description}</p>
        </div>
                
        {suggestion.matchReason && (
            <p className="text-sm text-slate-400 mb-4 italic bg-slate-700/40 p-3 rounded-md leading-relaxed">
                <span className="font-semibold not-italic text-sky-400/80">Match Insight:</span> {suggestion.matchReason}
            </p>
        )}
        
        {suggestion.detailedReasoning && (
          <div className="mb-4">
            <h4 className="text-md font-semibold text-sky-300 mb-1.5">Detailed Reasoning:</h4>
            <div className={`text-sm text-slate-300 overflow-hidden transition-all duration-300 ease-in-out ${isDetailedReasoningExpandedInternally ? 'max-h-[1000px]' : 'max-h-20 line-clamp-3'}`}> 
              {suggestion.detailedReasoning}
            </div>
            {suggestion.detailedReasoning.length > 100 && (
              <button 
                onClick={() => setIsDetailedReasoningExpandedInternally(!isDetailedReasoningExpandedInternally)}
                className="text-xs text-sky-400 hover:text-sky-300 mt-2 flex items-center font-medium group"
              >
                {isDetailedReasoningExpandedInternally ? 'Read Less' : 'Read More'}
                {isDetailedReasoningExpandedInternally ? 
                  <ChevronUpIcon className="w-4 h-4 ml-1 group-hover:translate-y-[-1px] transition-transform" /> : 
                  <ChevronDownIcon className="w-4 h-4 ml-1 group-hover:translate-y-[1px] transition-transform" />} 
              </button>
            )}
          </div>
        )}

        {suggestion.mustDoActivities && suggestion.mustDoActivities.length > 0 && (
            <div className="mb-5">
                <h4 className="text-md font-semibold text-sky-300 mb-2">Must-Do Activities:</h4>
                <ul className="list-disc list-inside pl-1 space-y-1.5">
                    {suggestion.mustDoActivities.map(activity => (
                        <li key={activity} className="text-sm text-slate-300 flex items-start">
                            <SuitabilityIcon className="w-4 h-4 mr-2.5 text-emerald-400 shrink-0 mt-1" /> 
                            {activity}
                        </li>
                    ))}
                </ul>
            </div>
        )}

        <div className="mt-auto pt-5 border-t border-slate-700 space-y-3">
          {[ { href: suggestion.googleMapsUrl, label: "View on Google Maps" },
             { href: suggestion.tripAdvisorUrl, label: "Explore on TripAdvisor" },
          ].map(link => (
            link.href && <a
              key={link.label}
              href={link.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-sky-400 hover:text-sky-300 hover:underline transition-colors duration-150 ease-in-out flex items-center group"
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