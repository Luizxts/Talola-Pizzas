
-- Add opening_time and closing_time columns to store_settings table
ALTER TABLE public.store_settings 
ADD COLUMN opening_time TEXT DEFAULT '18:00',
ADD COLUMN closing_time TEXT DEFAULT '00:00';

-- Update existing records to have default values
UPDATE public.store_settings 
SET opening_time = '18:00', closing_time = '00:00' 
WHERE opening_time IS NULL OR closing_time IS NULL;
