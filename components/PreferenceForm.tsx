import React, { useState, useCallback } from 'react';
import { UserPreferences, SelectOption } from '../src/types';
import { HOLIDAY_TYPES, BUDGET_OPTIONS, COMPANION_OPTIONS, CLIMATE_OPTIONS, DURATION_OPTIONS } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';
import { ResetIcon } from './icons/ResetIcon';

interface PreferenceFormProps {
  initialPreferences: UserPreferences;
  onSubmit: (preferences: UserPreferences) => void;
  onReset: () => void;
  isLoading: boolean;
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({ id, label, value, onChange, options, disabled }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
      {label}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-slate-700 border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm text-slate-100 transition duration-150 ease-in-out disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);


export const PreferenceForm: React.FC<PreferenceFormProps> = ({ initialPreferences, onSubmit, onReset, isLoading }) => {
  const [currentPreferences, setCurrentPreferences] = useState<UserPreferences>(initialPreferences);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setCurrentPreferences(prev => ({ ...prev, [name]: value }));
  }, []);
  
  React.useEffect(() => {
    setCurrentPreferences(initialPreferences);
  }, [initialPreferences]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(currentPreferences);
  };

  const handleResetClick = () => {
    onReset();
    // setCurrentPreferences is handled by useEffect listening to initialPreferences prop change
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          id="holidayType"
          label="Type of Holiday"
          value={currentPreferences.holidayType}
          onChange={handleChange}
          options={HOLIDAY_TYPES}
          disabled={isLoading}
        />
        <SelectField
          id="budget"
          label="Budget"
          value={currentPreferences.budget}
          onChange={handleChange}
          options={BUDGET_OPTIONS}
          disabled={isLoading}
        />
        <SelectField
          id="companions"
          label="Traveling With"
          value={currentPreferences.companions}
          onChange={handleChange}
          options={COMPANION_OPTIONS}
          disabled={isLoading}
        />
        <SelectField
          id="climate"
          label="Preferred Climate"
          value={currentPreferences.climate}
          onChange={handleChange}
          options={CLIMATE_OPTIONS}
          disabled={isLoading}
        />
        <SelectField
          id="duration"
          label="Trip Duration"
          value={currentPreferences.duration}
          onChange={handleChange}
          options={DURATION_OPTIONS}
          disabled={isLoading}
        />
        <div className="md:col-span-2">
          <label htmlFor="interests" className="block text-sm font-medium text-slate-300 mb-1">
            Interests & Activities
          </label>
          <textarea
            id="interests"
            name="interests"
            rows={3}
            value={currentPreferences.interests}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="e.g., history, food, nightlife, nature, art, museums, hiking, skiing, specific cuisines..."
            className="mt-1 block w-full shadow-sm sm:text-sm bg-slate-700 border-slate-600 rounded-md text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 ease-in-out disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-slate-400">Be specific for better suggestions!</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0 pt-4">
         <button
          type="button"
          onClick={handleResetClick}
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slate-600 shadow-sm text-base font-medium rounded-md text-slate-200 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ResetIcon className="w-5 h-5 mr-2 -ml-1" />
          Reset Form
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Suggesting...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2 -ml-1" />
              Get Suggestions
            </>
          )}
        </button>
      </div>
    </form>
  );
};