import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url); // Use searchParams to get query parameters
  const input = searchParams.get('input'); // Extract the `input` query parameter

  if (!input) {
    return NextResponse.json(
      { error: 'Input query parameter is required' },
      { status: 400 }
    );
  }

  const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${process.env.GOOGLE_API_KEY}&types=(regions)&language=en`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching Google Places data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Google Places API' },
      { status: 500 }
    );
  }
}
