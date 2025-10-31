-- Fix search_path for all functions to prevent security issues

-- Fix update_order_timestamps function
CREATE OR REPLACE FUNCTION public.update_order_timestamps()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status = 'in_progress' AND (OLD.status IS NULL OR OLD.status = 'pending') THEN
    NEW.payment_confirmed_at = NOW();
  END IF;
  
  IF NEW.status = 'delivered' AND OLD.status = 'in_progress' THEN
    NEW.delivered_at = NOW();
  END IF;
  
  IF NEW.status = 'completed' AND OLD.status = 'delivered' THEN
    NEW.completed_at = NOW();
  END IF;
  
  IF NEW.status = 'disputed' AND OLD.status != 'disputed' THEN
    NEW.disputed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;