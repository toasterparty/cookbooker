import { createClient } from '@supabase/supabase-js'

export const supabase_url = 'https://supabase.toasterparty.net'
export const supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICAgInJvbGUiOiAiYW5vbiIsCiAgICAiaXNzIjogInN1cGFiYXNlIiwKICAgICJpYXQiOiAxNjgzMzU2NDAwLAogICAgImV4cCI6IDE4NDEyMDkyMDAKfQ.9ADxq4L1Apzrq-TDmB7dTGwJGMN6jYDzZB_jfcH_NQU'

export const supabase = createClient(
  supabase_url,
  supabase_key
)
