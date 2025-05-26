import React, { useState, useCallback, useEffect } from 'react';
import { PreferenceForm } from './components/PreferenceForm';
import { DestinationCard } from './components/DestinationCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { PlaneIcon } from './components/icons/PlaneIcon';
import { getTravelSuggestions } from './services/openaiService';
import { UserPreferences, DestinationSuggestion, SavedSearch } from './src/types';
import { DEFAULT_PREFERENCES } from './src/constants';

const App: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [suggestions, setSuggestions] = useState<DestinationSuggestion[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  const handlePreferencesSubmit = useCallback(async (submittedPreferences: UserPreferences) => {
    setPreferences(submittedPreferences);
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const result = await getTravelSuggestions(submittedPreferences);
      setSuggestions(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      console.error("Error fetching suggestions:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedSearches = localStorage.getItem('travelSuggesterFavorites');
    if (storedSearches) {
      setSavedSearches(JSON.parse(storedSearches));
    }
  }, []);

  const handleSaveSearch = useCallback(() => {
    const searchName = prompt("Enter a name for this search:", "My Favorite Search");
    if (searchName) {
      const newSavedSearch: SavedSearch = {
        id: Date.now().toString(),
        name: searchName,
        preferences: preferences,
        createdAt: new Date().toISOString(),
      };
      const updatedSearches = [...savedSearches, newSavedSearch];
      setSavedSearches(updatedSearches);
      localStorage.setItem('travelSuggesterFavorites', JSON.stringify(updatedSearches));
      alert("Search saved!");
    }
  }, [preferences, savedSearches]);

  const handleLoadSearch = useCallback((searchId: string) => {
    const searchToLoad = savedSearches.find(s => s.id === searchId);
    if (searchToLoad) {
      handlePreferencesSubmit(searchToLoad.preferences);
      alert(`Loaded and submitted search: ${searchToLoad.name}`);
    }
  }, [savedSearches, handlePreferencesSubmit]);

  const handleDeleteSearch = useCallback((searchId: string) => {
    const updatedSearches = savedSearches.filter(s => s.id !== searchId);
    setSavedSearches(updatedSearches);
    localStorage.setItem('travelSuggesterFavorites', JSON.stringify(updatedSearches));
    alert("Saved search deleted.");
  }, [savedSearches]);

  const handleReset = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    setSuggestions(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-slate-200 p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-6xl mb-8 text-center">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <PlaneIcon className="w-12 h-12 text-sky-400" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            AI Travel Suggester
          </h1>
        </div>
        <p className="text-lg text-sky-200">
          Discover your next dream destination tailored to your preferences!
        </p>
      </header>

      <main className="w-full max-w-6xl lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <div className="bg-slate-800/70 backdrop-blur-lg shadow-2xl shadow-sky-900/50 rounded-xl p-6 sm:p-8">
            <PreferenceForm
              initialPreferences={preferences}
              onSubmit={handlePreferencesSubmit}
              onReset={handleReset}
              isLoading={isLoading}
            />
          </div>

          {isLoading && <div className="mt-8"><LoadingSpinner /></div>} 
          {error && <div className="mt-8"><ErrorDisplay message={error} /></div>}

          {suggestions && suggestions.length > 0 && (
            <div className="mt-10">
              <h2 className="text-3xl font-bold text-center mb-8 text-sky-400">
                Your Personalized Suggestions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {suggestions.map((suggestion, index) => (
                  <DestinationCard key={index} suggestion={suggestion} />
                ))}
              </div>
            </div>
          )}
          {suggestions && suggestions.length === 0 && !isLoading && !error && (
            <div className="mt-10 text-center text-slate-400">
              <p className="text-xl">No suggestions found for your criteria.</p>
              <p>Try adjusting your preferences for different results!</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-slate-800/70 backdrop-blur-lg shadow-2xl shadow-sky-900/50 rounded-xl p-6 sm:p-8 sticky top-8">
            <h3 className="text-xl font-semibold text-sky-300 mb-4">Your Favorite Searches</h3>
            
            {!isLoading && suggestions && suggestions.length > 0 && (
              <div className="mb-6">
                <button 
                  onClick={handleSaveSearch} 
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition-colors duration-150 flex items-center justify-center"
                >
                  Save Current Search
                </button>
              </div>
            )}
            
            {savedSearches.length > 0 ? (
              <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {savedSearches.map(search => (
                  <li key={search.id} className="flex justify-between items-center p-3 bg-slate-700/60 rounded-lg hover:bg-slate-600/60 transition-colors">
                    <button onClick={() => handleLoadSearch(search.id)} className="text-left hover:text-sky-400 flex-grow mr-2">
                      <span className="block font-medium text-slate-100">{search.name}</span>
                      <span className="text-xs text-slate-400">Saved: {new Date(search.createdAt).toLocaleDateString()}</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteSearch(search.id)} 
                      className="text-red-500 hover:text-red-400 text-sm font-semibold p-1.5 rounded-md hover:bg-red-500/20 transition-colors shrink-0"
                      aria-label="Delete saved search"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">No saved searches yet. Complete a search and save it to see it here!</p>
            )}
          </div>
        </div>
      </main>
      <footer className="w-full max-w-6xl mt-12 text-center">
        <p className="text-sm text-slate-500">
          Powered by OpenAI. Images from Unsplash.
        </p>
      </footer>
    </div>
  );
};

export default App;