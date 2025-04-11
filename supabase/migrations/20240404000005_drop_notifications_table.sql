-- Drop notifications table and related objects
DROP TABLE IF EXISTS public.notifications CASCADE;

-- Drop any remaining related functions
DROP FUNCTION IF EXISTS public.handle_notifications_updated_at();

-- Drop any remaining related triggers
DROP TRIGGER IF EXISTS set_notifications_updated_at ON public.notifications; 