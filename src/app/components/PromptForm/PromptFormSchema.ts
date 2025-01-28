import { z } from 'zod';

// Define the schema for the location value object
const locationValueSchema = z.object({
  lat: z.string(), // OpenStreetMap returns coordinates as strings
  lon: z.string(),
  osmId: z.number(),
});

// Define the schema for the complete location option
const locationSchema = z
  .object({
    value: locationValueSchema,
    label: z.string(),
    type: z.string(),
    importance: z.number(),
  })
  .nullable() // Allow null for when no location is selected
  .refine((data) => data !== null, {
    message: 'Please select a location',
  });

export const formSchema = z.object({
  vibe: z.string().nonempty('Please tell us what the vibes are'), // Ensure the field is not empty
  location: locationSchema,
});

export type FormData = z.infer<typeof formSchema>;
