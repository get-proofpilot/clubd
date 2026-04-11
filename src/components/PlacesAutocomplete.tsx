'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';

export interface PlaceResult {
  name: string;
  address: string;
  lat: string;
  lng: string;
  placeId: string;
}

interface PlacesAutocompleteProps {
  value: string;
  onSelect: (place: PlaceResult) => void;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

let googleLoaded = false;
let googleLoadPromise: Promise<void> | null = null;

function loadGoogle(): Promise<void> {
  if (googleLoaded) return Promise.resolve();
  if (googleLoadPromise) return googleLoadPromise;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
  if (!apiKey) {
    console.warn('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not set');
    return Promise.resolve();
  }

  const loader = new Loader({ apiKey, libraries: ['places'] });
  googleLoadPromise = (loader as any).importLibrary('places').then(() => {
    googleLoaded = true;
  });
  return googleLoadPromise!;
}

export default function PlacesAutocomplete({
  value,
  onSelect,
  onChange,
  placeholder = 'Search for a venue or address',
  className = '',
}: PlacesAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dummyDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGoogle().then(() => {
      if (window.google?.maps?.places) {
        autocompleteService.current = new google.maps.places.AutocompleteService();
        if (dummyDiv.current) {
          placesService.current = new google.maps.places.PlacesService(dummyDiv.current);
        }
      }
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(
    (input: string) => {
      if (!autocompleteService.current || input.length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      autocompleteService.current.getPlacePredictions(
        { input, types: ['establishment', 'geocode'] },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
            setIsOpen(true);
          } else {
            setSuggestions([]);
            setIsOpen(false);
          }
        },
      );
    },
    [],
  );

  const handleSelect = useCallback(
    (prediction: google.maps.places.AutocompletePrediction) => {
      if (!placesService.current) return;

      setIsLoading(true);
      placesService.current.getDetails(
        { placeId: prediction.place_id, fields: ['name', 'formatted_address', 'geometry', 'place_id'] },
        (place, status) => {
          setIsLoading(false);
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            const result: PlaceResult = {
              name: place.name ?? prediction.structured_formatting.main_text,
              address: place.formatted_address ?? prediction.description,
              lat: place.geometry.location.lat().toString(),
              lng: place.geometry.location.lng().toString(),
              placeId: place.place_id ?? prediction.place_id,
            };
            onSelect(result);
            onChange(result.name + (result.address ? ` - ${result.address}` : ''));
          }
          setIsOpen(false);
          setSuggestions([]);
        },
      );
    },
    [onSelect, onChange],
  );

  const inputClasses =
    'h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 pl-10 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div ref={dummyDiv} className="hidden" />
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[var(--color-text-muted)]" />
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={inputClasses}
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] shadow-lg">
          {suggestions.map((s) => (
            <li key={s.place_id}>
              <button
                type="button"
                onClick={() => handleSelect(s)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface-subtle)]"
              >
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-text-muted)]" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                    {s.structured_formatting.main_text}
                  </p>
                  <p className="truncate text-xs text-[var(--color-text-muted)]">
                    {s.structured_formatting.secondary_text}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
