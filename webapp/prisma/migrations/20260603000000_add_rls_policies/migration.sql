-- Enable Row Level Security on all public tables
-- Prisma connects via DATABASE_URL (direct connection) and bypasses RLS,
-- so enabling RLS here has no effect on the application.
-- This protects against direct PostgREST access via the anon key.

-- anon role is created by Supabase; create it locally if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
END $$;

-- _prisma_migrations: no external access needed
-- IF EXISTS ensures this is safe in Prisma's shadow database
-- (which doesn't pre-create _prisma_migrations before running user migrations)
ALTER TABLE IF EXISTS public._prisma_migrations ENABLE ROW LEVEL SECURITY;

-- categories: public read
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories"
  ON public.categories FOR SELECT TO anon USING (true);

-- tags: public read
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tags"
  ON public.tags FOR SELECT TO anon USING (true);

-- article_tags: public read
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read article_tags"
  ON public.article_tags FOR SELECT TO anon USING (true);

-- articles: published only
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published articles"
  ON public.articles FOR SELECT TO anon
  USING (status = 'PUBLISHED');

-- landing_pages: published only
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published landing_pages"
  ON public.landing_pages FOR SELECT TO anon
  USING (status = 'PUBLISHED');

-- lp_images: public read
ALTER TABLE public.lp_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read lp_images"
  ON public.lp_images FOR SELECT TO anon USING (true);
