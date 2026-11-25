import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xdblmnruamyrvcdwhiqy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkYmxtbnJ1YW15cnZjZHdoaXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDI1MzEsImV4cCI6MjA4NTY3ODUzMX0.34q5CJWX37nf2sZN8F1UhlcJ-2IdaQTLLh_8zOe1eI8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
