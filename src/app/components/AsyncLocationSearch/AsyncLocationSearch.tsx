/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import { StylesConfig } from 'react-select';
export const AsyncLocationSearch = ({
  register,
  setValue,
  name,
  errors,
}: {
  register: UseFormRegister<{
    vibe: string;
    location: string;
  }>;
  setValue: UseFormSetValue<{
    vibe: string;
    location: {
      value: {
        lat: string;
        lon: string;
        osmId: number;
      };
      type: string;
      label: string;
      importance: number;
    };
  }>;
  name: 'vibe' | 'location';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  console.log(selectedOption);

  // Register the input
  const { ref } = register(name);

  // Function to fetch locations from OpenStreetMap's Nominatim API
  const loadLocations = async (inputValue: string | number | boolean) => {
    if (!inputValue) return [];

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputValue)}&limit=10`,
        {
          headers: {
            'User-Agent': 'YourApp/1.0 (your@email.com)',
          },
        }
      );

      const data = await response.json();

      return data.map(
        (location: {
          lat: number;
          lon: number;
          osm_id: string;
          display_name: string;
          type: string;
          importance: string;
        }) => ({
          value: {
            lat: location.lat,
            lon: location.lon,
            osmId: location.osm_id,
          },
          label: location.display_name,
          type: location.type,
          importance: location.importance,
        })
      );
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debouncedLoadLocations = (inputValue: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(loadLocations(inputValue));
      }, 300);
    });
  };
  // @ts-ignore
  const handleChange = (option) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelectedOption(option);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(name, option); // Update form value
  };

  const customStyles = {
    option: (provided: StylesConfig) => ({
      ...provided,
      fontSize: '14px',
      padding: '8px 12px',
    }),
    control: (provided: StylesConfig) => ({
      ...provided,
      minHeight: '40px',
    }),
  };

  return (
    <div className="w-full max-w-md">
      <AsyncSelect
        ref={ref}
        cacheOptions
        defaultOptions={false}
        value={selectedOption}
        className={`w-full    rounded-lg outline-none transition-colors ${
          errors?.location
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        }`}
        //  @ts-ignore
        loadOptions={debouncedLoadLocations}
        onChange={handleChange}
        placeholder="Search for a location..."
        noOptionsMessage={({ inputValue }) =>
          !inputValue
            ? 'Start typing to search locations...'
            : 'No locations found'
        }
        loadingMessage={() => 'Searching...'}
        // @ts-ignore
        styles={customStyles}
        formatOptionLabel={(option) => (
          <div>
            {/* @ts-ignore */}
            <div className="font-medium">{option.label.split(',')[0]}</div>
            <div className="text-sm text-gray-600">
              {/* @ts-ignore */}
              {option?.label.split(',').slice(1).join(',').trim()}
            </div>
          </div>
        )}
      />
    </div>
  );
};
