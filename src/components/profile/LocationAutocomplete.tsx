'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (field: string, value: string) => void;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
}

export default function LocationAutocomplete({
  value,
  onChange,
  focusedField,
  setFocusedField,
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSelected, setIsSelected] = useState(!!value);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`,
        { headers: { 'Accept-Language': 'en', 'User-Agent': 'FourFlowOS/1.0' } }
      );
      const data: NominatimResult[] = await res.json();
      setResults(data);
      setShowDropdown(data.length > 0);
    } catch {
      setResults([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsSelected(false);
    // Clear stored coords when user edits
    onChange('birth_location', val);
    onChange('birth_lat', '');
    onChange('birth_lng', '');

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 400);
  };

  const handleSelect = (result: NominatimResult) => {
    setQuery(result.display_name);
    setIsSelected(true);
    setShowDropdown(false);
    setResults([]);
    onChange('birth_location', result.display_name);
    onChange('birth_lat', result.lat);
    onChange('birth_lng', result.lon);
  };

  const handleClear = () => {
    setQuery('');
    setIsSelected(false);
    setResults([]);
    onChange('birth_location', '');
    onChange('birth_lat', '');
    onChange('birth_lng', '');
  };

  const isFocused = focusedField === 'birth_location';

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`flex items-center w-full px-4 py-3 bg-white/[0.05] border rounded-xl transition-all duration-300 ${
          isFocused
            ? 'border-white/30 bg-white/[0.08] ring-2 ring-white/10'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setFocusedField('birth_location');
            if (results.length > 0) setShowDropdown(true);
          }}
          onBlur={() => setFocusedField(null)}
          placeholder="Search city or town..."
          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
          autoComplete="off"
        />
        {loading && (
          <svg className="w-4 h-4 text-gray-500 animate-spin flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {isSelected && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-2 text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
            aria-label="Clear location"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-xl">
          {results.map((result) => {
            const parts = result.display_name.split(', ');
            const city = parts[0];
            const rest = parts.slice(1).join(', ');
            return (
              <button
                key={result.place_id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(result);
                }}
                className="w-full text-left px-4 py-3 hover:bg-white/[0.06] transition-colors border-b border-white/5 last:border-0"
              >
                <span className="block text-white text-sm font-medium">{city}</span>
                {rest && <span className="text-gray-500 text-xs">{rest}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
