import dotenv from 'dotenv'
import path from 'path'

// Load env relative to project root
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') })

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('SUPABASE_URL:', supabaseUrl) // ← add this to debug

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey)