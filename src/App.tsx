import React, { useState, useEffect, useCallback } from 'react';
import { DestinationSuggestion, UserPreferences, SavedSearch } from './types';
// ... (other imports: PreferenceForm, DestinationCard, Icons, etc.)
import { PreferenceForm } from '../components/PreferenceForm';
import { DestinationCard } from './components/DestinationCard';
import { SaveIcon, TrashIcon, HeartIcon, RefreshCwIcon, ListIcon, XIcon, ArrowRightIcon } from '../components/icons/AppIcons'; // Assuming you have these

const API_URL = '/api/getSuggestions';

const DEFAULT_PREFERENCES: UserPreferences = {
  holidayType: 'Adventure',
  budget: 'Mid-range',
  companions: 'Solo',
  climate: 'Temperate',
  interests: 'Hiking, Photography',
  duration: '1 week',
  travelMonth: 'Any',
};

const App: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [suggestions, setSuggestions] = useState<DestinationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null); // To track expanded card

  useEffect(() => {
    const loadedSearches = localStorage.getItem('travelSearches');
    if (loadedSearches) {
      setSavedSearches(JSON.parse(loadedSearches));
    }
  }, []);

  const handlePreferencesChange = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
  };

  const fetchSuggestions = useCallback(async (currentPreferences: UserPreferences) => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    setExpandedCardId(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPreferences),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network response was not ok' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data: DestinationSuggestion[] = await response.json();
      const suggestionsWithId = data.map((suggestion, index) => ({
        ...suggestion,
        id: suggestion.name + '-' + index
      }));
      setSuggestions(suggestionsWithId);

    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || 'Failed to fetch suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGetSuggestions = () => {
    fetchSuggestions(preferences);
  };

  const handleSurpriseMe = () => {
    const surprisePrefs: UserPreferences = {
      ...DEFAULT_PREFERENCES, // Start with defaults for non-specified surprise fields
      holidayType: 'SURPRISE_ME', 
      budget: preferences.budget, // Keep user's budget
      companions: preferences.companions, // Keep user's companions
      climate: 'SURPRISE_ME',
      interests: 'SURPRISE_ME',
      duration: 'SURPRISE_ME',
      travelMonth: 'SURPRISE_ME',
    };
    setPreferences(surprisePrefs); // Update the form to reflect surprise me state
    fetchSuggestions(surprisePrefs); // Fetch with surprise me settings
  };

  // ... (saveSearch, loadSearch, deleteSearch, toggleSavedSearches functions)
  const saveSearch = () => {
    const searchName = prompt("Enter a name for this search:", "My Travel Plan");
    if (searchName) {
      const newSave: SavedSearch = {
        id: `saved-${Date.now()}`,
        name: searchName,
        preferences: preferences,
        createdAt: new Date().toISOString(),
      };
      const updatedSearches = [...savedSearches, newSave];
      setSavedSearches(updatedSearches);
      localStorage.setItem('travelSearches', JSON.stringify(updatedSearches));
    }
  };

  const loadSearch = (searchId: string) => {
    const searchToLoad = savedSearches.find(s => s.id === searchId);
    if (searchToLoad) {
      setPreferences(searchToLoad.preferences);
      fetchSuggestions(searchToLoad.preferences);
      setShowSavedSearches(false);
    }
  };

  const deleteSearch = (searchId: string) => {
    if (window.confirm("Are you sure you want to delete this saved search?")) {
      const updatedSearches = savedSearches.filter(s => s.id !== searchId);
      setSavedSearches(updatedSearches);
      localStorage.setItem('travelSearches', JSON.stringify(updatedSearches));
    }
  };

  const toggleSavedSearches = () => {
    setShowSavedSearches(!showSavedSearches);
  };

  const handleToggleExpand = (suggestionId: string) => {
    console.log("App.tsx: Toggling expand for suggestion ID:", suggestionId); // Diagnostic log
    setExpandedCardId(prevId => (prevId === suggestionId ? null : suggestionId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-sky-900 text-slate-100 flex flex-col items-center p-4 md:p-8 selection:bg-sky-500 selection:text-white">
      <header className="w-full max-w-6xl mb-8 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 py-2">
          AI Travel Suggester
        </h1>
        <p className="mt-3 text-lg text-sky-200/80">Discover your next adventure, powered by AI.</p>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Preferences Form - Spanning 4 columns on large screens */} 
        <div className="lg:col-span-4 xl:col-span-3 bg-slate-800/70 backdrop-blur-md p-6 rounded-xl shadow-2xl ring-1 ring-slate-700/50 lg:sticky lg:top-8">
          <PreferenceForm 
            preferences={preferences} 
            onPreferencesChange={handlePreferencesChange} 
            onSubmit={handleGetSuggestions} 
            onSurpriseMe={handleSurpriseMe}
            isLoading={isLoading}
          />
          <div className="mt-6 pt-6 border-t border-slate-700/50 space-y-3">
            <button 
                onClick={saveSearch}
                disabled={suggestions.length === 0} // Disable if no suggestions to save basis on
                className="w-full flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out group"
            >
                <SaveIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> Save Current Search
            </button>
            <button 
                onClick={toggleSavedSearches}
                className="w-full flex items-center justify-center px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out group"
            >
                {showSavedSearches ? <XIcon className="w-5 h-5 mr-2" /> : <ListIcon className="w-5 h-5 mr-2 group-hover:animate-pulse" />} 
                {showSavedSearches ? 'Hide Saved' : 'Show Saved Searches'} ({savedSearches.length})
            </button>
          </div>
        </div>

        {/* Suggestions Area - Spanning 8 columns on large screens */} 
        <main className="lg:col-span-8 xl:col-span-9 space-y-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-10 bg-slate-800/50 rounded-xl shadow-lg">
              <RefreshCwIcon className="w-16 h-16 text-sky-400 animate-spin mb-6" />
              <p className="text-xl font-semibold text-sky-300">Crafting your tailored suggestions...</p>
              <p className="text-sm text-sky-400/70">This might take a moment. Good things come to those who wait!</p>
            </div>
          )}
          {error && (
            <div className="bg-red-700/30 border border-red-600/50 text-red-300 p-6 rounded-xl shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong.</h3>
              <p className="text-sm">{error}</p>
              <button 
                onClick={handleGetSuggestions} 
                className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg transition-colors">
                  Try Again
              </button>
            </div>
          )}

          {!isLoading && !error && suggestions.length === 0 && (
            <div className="text-center p-10 bg-slate-800/50 rounded-xl shadow-lg">
              <HeartIcon className="w-20 h-20 text-sky-500/70 mx-auto mb-6 opacity-60" />
              <h2 className="text-2xl font-semibold text-sky-300 mb-2">Ready for an adventure?</h2>
              <p className="text-sky-400/80 mb-6">Fill in your preferences on the left and click "Get Suggestions"!</p>
              <button 
                onClick={() => document.querySelector('form button[type="submit"]')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 group"
              >
                Let's Go! <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"/>
              </button>
            </div>
          )}

          {/* List of Destination Cards - single column */} 
          {suggestions.map(suggestion => (
            <DestinationCard 
              key={suggestion.id!}
              suggestion={suggestion} 
              isExpanded={expandedCardId === suggestion.id}
              onToggleExpand={() => handleToggleExpand(suggestion.id!)} 
            />
          ))}
        </main>
        
        {/* Saved Searches Panel (Modal or Sliding Panel) */} 
        {showSavedSearches && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-40 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out" onClick={toggleSavedSearches}>
            <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl ring-1 ring-slate-700/50 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-sky-400">Your Saved Searches</h2>
                <button onClick={toggleSavedSearches} className="text-slate-400 hover:text-sky-300 transition-colors">
                  <XIcon className="w-7 h-7" />
                </button>
              </div>
              {savedSearches.length === 0 ? (
                <p className="text-slate-400 text-center py-4">You haven't saved any searches yet.</p>
              ) : (
                <ul className="space-y-4">
                  {savedSearches.map(search => (
                    <li key={search.id} className="bg-slate-700/50 p-4 rounded-lg ring-1 ring-slate-600/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-sky-300 mb-1">{search.name}</h3>
                          <p className="text-xs text-slate-400">
                            Saved on: {new Date(search.createdAt).toLocaleDateString()} - {Object.values(search.preferences).filter(v => v && v !== 'SURPRISE_ME' && v !== 'Any').slice(0,3).join(', ')}{Object.values(search.preferences).filter(v => v && v !== 'SURPRISE_ME' && v !== 'Any').length > 3 ? '...' : ''}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                           <button 
                            onClick={() => loadSearch(search.id)} 
                            className="p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors group"
                            title="Load this search"
                          >
                            <RefreshCwIcon className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                          </button>
                          <button 
                            onClick={() => deleteSearch(search.id)} 
                            className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors group"
                            title="Delete this search"
                           >
                            <TrashIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

      </div>

      <footer className="w-full max-w-6xl mt-16 pt-8 border-t border-slate-700/50 text-center text-sm text-slate-400/70">
        <p>&copy; {new Date().getFullYear()} AI Travel Suggester. Your adventure awaits!</p>
        <p className="mt-1">Images from <a href="https://unsplash.com?utm_source=ai_travel_suggester&utm_medium=referral" target="_blank" rel="noopener noreferrer" className="underline hover:text-sky-300 transition-colors">Unsplash</a>. Travel data by OpenAI.</p>
      </footer>
    </div>
  );
};

export default App; 