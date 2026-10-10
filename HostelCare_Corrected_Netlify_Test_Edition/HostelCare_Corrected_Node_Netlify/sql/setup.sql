-- Run ONCE in Supabase SQL Editor (private server-side demo state).
-- WARNING: This single-row JSONB store is intended for a small testing pilot only.
-- It is NOT the normalized production database architecture.
CREATE TABLE IF NOT EXISTS public.hcms_state (
  id integer PRIMARY KEY CHECK(id=1),
  version bigint NOT NULL DEFAULT 0,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb
);
INSERT INTO public.hcms_state(id,version,payload)
VALUES(1,0,'{}'::jsonb) ON CONFLICT(id) DO NOTHING;
REVOKE ALL ON public.hcms_state FROM anon, authenticated;
ALTER TABLE public.hcms_state ENABLE ROW LEVEL SECURITY;
-- No client-side policies. Service-role key is held exclusively on Netlify's server.
CREATE OR REPLACE FUNCTION public.hcms_state_commit(expected_version bigint,next_payload jsonb)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
BEGIN
 UPDATE public.hcms_state SET payload=next_payload,version=version+1
 WHERE id=1 AND version=expected_version;
 RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.hcms_state_commit(bigint,jsonb) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.hcms_state_commit(bigint,jsonb) TO service_role;
-- Create a PRIVATE bucket in Storage UI called complaint-photos.
