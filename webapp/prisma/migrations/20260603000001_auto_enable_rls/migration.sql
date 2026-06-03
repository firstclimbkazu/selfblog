-- Automatically enable RLS on any new table created in the public schema.
-- This ensures future tables are secure by default.

CREATE OR REPLACE FUNCTION public.auto_enable_rls()
RETURNS event_trigger
LANGUAGE plpgsql
AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN
    SELECT * FROM pg_event_trigger_ddl_commands()
    WHERE command_tag = 'CREATE TABLE'
      AND schema_name = 'public'
  LOOP
    EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', obj.schema_name, obj.object_identity);
  END LOOP;
END;
$$;

CREATE EVENT TRIGGER auto_enable_rls_trigger
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE')
  EXECUTE FUNCTION public.auto_enable_rls();
