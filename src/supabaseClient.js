import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hvzzpfhyghxvhtfvtivo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2enpwZmh5Z2h4dmh0ZnZ0aXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMzMjI2MTUsImV4cCI6MjAxODg5ODYxNX0.ndFqLUSq-Urz2oaEsnAZlVdSCQIJUs3U710O1NANT7k";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
