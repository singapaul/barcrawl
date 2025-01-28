import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set in the environment variables');
}

const googleApiKey = GOOGLE_API_KEY; // Use the environment variable

interface PlaceData {
  name: string;
  lat: number | null;
  lng: number | null;
  type: string;
  error?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { places }: { places: { geocodeterm: string; type: string }[] } =
      await req.json();

    if (places.length === 0) {
      return NextResponse.json(
        { error: 'Please provide an array of place names' },
        { status: 400 }
      );
    }

    const placesData: PlaceData[] = [];

    // Loop through each place name and make a request to the Google Maps Geocoding API using fetch
    for (const place of places) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(place.geocodeterm)}&key=${googleApiKey}`
      );

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${place.geocodeterm}`);
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        placesData.push({
          name: place.geocodeterm,
          lat: location.lat,
          lng: location.lng,
          type: place.type,
        });
      } else {
        placesData.push({
          name: place.geocodeterm,
          lat: null,
          lng: null,
          error: 'Location not found',
          type: place.type,
        });
      }
    }

    return NextResponse.json(placesData, { status: 200 });
  } catch (error) {
    console.error('Error fetching data from Google Maps API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
