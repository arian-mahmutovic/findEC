import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://pwvdxsimneoaiclwhaac.supabase.co"

const supabaseKey = "sb_publishable_5OlR14fxGuwKEZzKJfUHBA_SEODCXmt"

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
)