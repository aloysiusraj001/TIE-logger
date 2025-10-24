// Type definitions updated for Supabase
export interface LogEntry {
  id: number; // Postgres primary key is a number
  plan: string;
  achievement: string;
  date: string; // The created_at timestamp will be fetched as a string
  userId: string; // Corresponds to the user's UUID in Supabase Auth
  userEmail?: string;
}

export interface User {
  id: string; // Supabase user ID is a string (UUID)
  email: string | undefined; // Supabase user email can be undefined
}
