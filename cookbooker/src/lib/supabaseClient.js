import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'http://192.168.0.186:8000',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICAgInJvbGUiOiAiYW5vbiIsCiAgICAiaXNzIjogInN1cGFiYXNlIiwKICAgICJpYXQiOiAxNjgzMzU2NDAwLAogICAgImV4cCI6IDE4NDEyMDkyMDAKfQ.9ADxq4L1Apzrq-TDmB7dTGwJGMN6jYDzZB_jfcH_NQU'
)
