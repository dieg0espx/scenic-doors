-- Allow 'white_glove' as a delivery type option
ALTER TABLE public.quotes DROP CONSTRAINT IF EXISTS quotes_delivery_type_check;
ALTER TABLE public.quotes ADD CONSTRAINT quotes_delivery_type_check CHECK (delivery_type IN ('delivery', 'pickup', 'white_glove'));
