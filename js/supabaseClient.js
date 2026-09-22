/* PakGig — Supabase client (single place for your project connection)
   This key is the public "anon"/"publishable" key — safe to expose in
   front-end code. Real security comes from the RLS policies and the
   SECURITY DEFINER functions already set up in the database. */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://itqfoihscpqlhwcktrht.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_AIFQlw5yPRG-NlKhPpyRfQ_19s9rzcB";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
