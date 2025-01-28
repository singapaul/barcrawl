import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateObject } from 'ai';
import { pubs } from '@/app/schema';

export async function POST(req: Request) {
  try {
    const { vibe, location } = await req.json();

    const formattedPrompt = `I want to go for a walk between some pubs and I want to see landmarks along the way. The locations should be in a logical order for walking around. Please only give me pubs and landmarks in ${location}. The locations should suit the following vibe and energy requested from the following prompt: ${vibe}. The total walking distance should not exceed 10km`;

    const { object } = await generateObject({
      model: openai('gpt-4'), // Note: fixed typo from 'gpt-4o' to 'gpt-4'
      schema: z.object({
        pubs,
      }),
      prompt: formattedPrompt,
    });

    return NextResponse.json(
      {
        message: 'success',
        pubs: object.pubs,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      {
        message: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
      }
    );
  }
}
