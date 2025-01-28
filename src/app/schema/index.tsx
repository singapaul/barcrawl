import { z } from 'zod';

export const pubs = z.array(
  z.object({
    locationPosition: z.number(),
    name: z.string(),
    description: z.string(),
    location: z.string(),
    locationType: z.enum(['landmark', 'pub']),
    geocodeterm: z.string(),
  })
);

export const pubsResponseSchema = z.object({
  message: z.string(),
  pubs,
});

export type PubsResponseType = z.infer<typeof pubsResponseSchema>;
export type PubsType = z.infer<typeof pubs>;
export type PubType = PubsType[0];
