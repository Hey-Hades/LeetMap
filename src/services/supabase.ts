import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- ADDED DATABASE FUNCTIONS ---

export const toggleProblemSolved = async (userId: string, problemId: string, companySlug: string) => {
  const { error } = await supabase
    .from('solved_problems')
    .insert([
      { 
        user_id: userId, 
        problem_id: problemId, 
        company_slug: companySlug 
      }
    ]);

  if (error) {
    // If it violates the unique constraint (they already solved it), that's actually fine for now!
    if (error.code !== '23505') { 
      console.error("Error saving progress:", error.message);
    }
    return false;
  }
  
  return true;
};