-- Create the 'orders' table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  total numeric NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own orders
CREATE POLICY "Users can insert their own orders."
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to read their own orders
CREATE POLICY "Users can view their own orders."
ON public.orders FOR SELECT
USING (auth.uid() = user_id);
