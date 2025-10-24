import { createClient } from "@supabase/supabase-js";

// From Supabase Dashboard > Project Settings > API
export const supabaseUrl = "https://ahdfncqmomhhkueixcsi.supabase.co";
export const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoZGZuY3Ftb21oaGt1ZWl4Y3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNTU5MTcsImV4cCI6MjA3NjgzMTkxN30.EnJr0quWaQsB0NDpT0Wy-X74PBAwdIoJNYvqvNbyiQA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);