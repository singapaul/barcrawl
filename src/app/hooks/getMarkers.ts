import { useState } from 'react';

import type { FormData } from '@/app/components/PromptForm/PromptFormSchema';
import { PubType, PubsType } from '@/app/schema';
interface UsePubMarkersReturn {
  pubs: PubsType;
  markers: { name: string; lat: number; lng: number }[];
  isLoading: boolean;
  handleSubmit: (data: FormData) => Promise<void>;
  handleGetRoute: () => void;
}

export function usePubMarkers(
  onSubmitSuccess?: () => void
): UsePubMarkersReturn {
  const [pubs, setPubs] = useState<PubsType>([]);
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Fetch pubs data
      const response = await fetch('/api/pubs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vibe: data.vibe,
          location: data.location.label,
        }),
      });

      const result = await response.json();

      const pubsWithLocation = result.pubs.map((pub: PubsType[0]) => ({
        ...pub,
        geocodeterm: `${pub.name}-${pub.location}`,
      }));

      setPubs(pubsWithLocation);

      const reqBody = pubsWithLocation.map((pub: PubType) => {
        return { geocodeterm: pub.geocodeterm, type: pub.locationType };
      });
      const markers = await fetch('/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ places: reqBody }),
      });

      const markersData = await markers.json();
      console.log(markersData);

      setMarkers(markersData);

      // Call success callback if provided
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetRoute = () => {
    const locations = pubs.map((pub) => `${pub.name}-${pub.location}`);
    window.open(
      `https://www.google.com/maps/dir/${locations.join('/')}`,
      '_blank'
    );
  };

  return {
    pubs,
    markers,
    isLoading,
    handleSubmit,
    handleGetRoute,
  };
}
