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

  // Moved handlePreferencesSubmit up as it's a dependency for handleLoadSearch
  const handlePreferencesSubmit = useCallback(async (submittedPreferences: UserPreferences) => {
    setPreferences(submittedPreferences); // Update current preferences state as well
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

  // Load saved searches from localStorage on mount
  useEffect(() => {
    const storedSearches = localStorage.getItem('travelSuggesterFavorites');
    if (storedSearches) {
      setSavedSearches(JSON.parse(storedSearches));
    }
  }, []);

  // Save current preferences as a favorite
  const handleSaveSearch = useCallback(() => {
    const searchName = prompt("Enter a name for this search:", "My Favorite Search");
    if (searchName) {
      const newSavedSearch: SavedSearch = {
        id: Date.now().toString(),
        name: searchName,
        preferences: preferences, // Use the current state of preferences
        createdAt: new Date().toISOString(),
      };
      const updatedSearches = [...savedSearches, newSavedSearch];
      setSavedSearches(updatedSearches);
      localStorage.setItem('travelSuggesterFavorites', JSON.stringify(updatedSearches));
      alert("Search saved!");
    }
  }, [preferences, savedSearches]);

  // Load a saved search into the form and submit
  const handleLoadSearch = useCallback((searchId: string) => {
    const searchToLoad = savedSearches.find(s => s.id === searchId);
    if (searchToLoad) {
      // setPreferences(searchToLoad.preferences); // This is done by handlePreferencesSubmit
      handlePreferencesSubmit(searchToLoad.preferences);
      alert(`Loaded and submitted search: ${searchToLoad.name}`);
    }
  }, [savedSearches, handlePreferencesSubmit]);

  // Delete a saved search
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
      <header className="w-full max-w-4xl mb-8 text-center">
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

      <main className="w-full max-w-4xl bg-slate-800/70 backdrop-blur-lg shadow-2xl shadow-sky-900/50 rounded-xl p-6 sm:p-8">
        {/* Section to display and manage saved searches - UI needed here */}
        {savedSearches.length > 0 && (
          <div className="mb-8 p-4 bg-slate-700/50 rounded-lg">
            <h3 className="text-xl font-semibold text-sky-300 mb-3">Your Favorite Searches</h3>
            <ul className="space-y-2">
              {savedSearches.map(search => (
                <li key={search.id} className="flex justify-between items-center p-2 bg-slate-600/50 rounded hover:bg-slate-500/50">
                  <button onClick={() => handleLoadSearch(search.id)} className="text-left hover:text-sky-400">
                    {search.name} <span className="text-xs text-slate-400">({new Date(search.createdAt).toLocaleDateString()})</span>
                  </button>
                  <button onClick={() => handleDeleteSearch(search.id)} className="text-red-400 hover:text-red-300 text-sm font-semibold p-1 rounded hover:bg-red-500/20">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <PreferenceForm
          initialPreferences={preferences} // Pass current preferences to the form
          onSubmit={handlePreferencesSubmit}
          onReset={handleReset}
          isLoading={isLoading}
        />

        {!isLoading && suggestions && suggestions.length > 0 && (
          <div className="mt-6 text-center">
            <button 
              onClick={handleSaveSearch} 
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition-colors duration-150"
            >
              Save Current Search as Favorite
            </button>
          </div>
        )}

        {isLoading && <LoadingSpinner />}
        {error && <ErrorDisplay message={error} />}

        {suggestions && suggestions.length > 0 && (
          <div className="mt-10">
            <h2 className="text-3xl font-bold text-center mb-8 text-sky-400">
              Your Personalized Suggestions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </main>
      <footer className="w-full max-w-4xl mt-12 text-center">
        <p className="text-sm text-slate-500">
          Powered by OpenAI. Images from Unsplash.
        </p>
      </footer>
    </div>
  );
};

export default App;