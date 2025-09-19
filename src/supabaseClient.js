// import 'dotenv/config'; // carrega automaticamente o .env
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export default supabase;

import 'dotenv/config'; // carrega automaticamente o .env
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ⚡ troquei aqui

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;