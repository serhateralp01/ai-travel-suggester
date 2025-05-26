import React from 'react';
import { DestinationSuggestion } from '../types'; // Assuming types.ts is in ../src or similar

// Define Props interface
interface DestinationCardProps {
  suggestion: DestinationSuggestion;
  index: number;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ suggestion, index }) => {
  // ... (existing consts and icon placeholders) ...

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
      <img src={suggestion.imageUrl} alt={`Visual for ${suggestion.name}`} className="w-full h-56 object-cover" />
      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-2 text-indigo-700">{index + 1}. {suggestion.name}</h3>
        <p className="text-sm text-gray-500 mb-1"><span className="font-semibold">Suitability:</span> {suggestion.suitability}</p>
        <p className="text-gray-700 mb-3 text-sm">{suggestion.description}</p>
        <p className="text-sm text-indigo-600 mb-1"><strong className="text-gray-700">Why it matches:</strong> {suggestion.matchReason}</p>
        <p className="text-sm text-gray-600 mb-4">{suggestion.detailedReasoning}</p>
        
        {suggestion.mustDoActivities && suggestion.mustDoActivities.length > 0 && (
          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-800 mb-1">Must-Do Activities:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {suggestion.mustDoActivities.map((activity: string, idx: number) => (
                <li key={idx}>{activity}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          {/* ... (existing links: Google Images, Maps, TripAdvisor) ... */}
          <a href={suggestion.imageSearchQuery ? `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(suggestion.imageSearchQuery)}` : `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(suggestion.name)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mr-3 mb-2 p-2 rounded-md hover:bg-blue-50 transition-colors">
            {/* ... (Google Images icon) ... */}
            <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.487 10.024c0 .407-.028.81-.085 1.206H12.36V14.09h4.61c-.197 1.139-.78 2.111-1.647 2.749v1.884h2.434a8.956 8.956 0 002.73-6.699z"/><path d="M12.36 21.023c2.295 0 4.202-.76 5.603-2.065l-2.434-1.884c-.76.51-1.738.811-2.92.811-2.413 0-4.458-1.62-5.187-3.796H4.64v1.953c1.485 2.94 4.298 4.981 7.72 4.981z"/><path d="M7.173 13.464a5.25 5.25 0 010-3.17V8.342H4.64a9.01 9.01 0 000 7.068l2.533-1.946z"/><path d="M12.36 6.168c1.243 0 2.363.426 3.243 1.264l2.157-2.147C16.321 3.56 14.483 2.7 12.36 2.7c-3.422 0-6.234 2.04-7.72 4.981L7.173 9.63c.73-2.176 2.774-3.462 5.187-3.462z"/></svg>
            Find Images on Google
          </a>
          {/* ... (rest of the links) ... */}
        </div>
      </div>
    </div>
  );
};

export default DestinationCard; 