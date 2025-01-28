import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://nztorgchnnndcxojmuxb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56dG9yZ2Nobm5uZGN4b2ptdXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMDA4MTQsImV4cCI6MjA1MTc3NjgxNH0.xXjWFGJxH_E5-vTeX0pcC9hcyOxll2IWRZbbxOwTB0I'
);
