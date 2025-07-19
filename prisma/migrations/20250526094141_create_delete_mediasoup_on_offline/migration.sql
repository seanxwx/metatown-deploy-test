CREATE OR REPLACE FUNCTION public.delete_mediasoup_on_offline()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'OFFLINE' THEN
    DELETE FROM public.user_space_mediasoup
    WHERE user_id = NEW.user_id
      AND space_id = NEW.space_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_mediasoup_on_offline
AFTER UPDATE ON public.user_space_presences
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION delete_mediasoup_on_offline();
