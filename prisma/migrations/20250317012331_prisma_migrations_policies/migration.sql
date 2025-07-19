CREATE policy "Enable insert for postgres admin only"
ON "public"."_prisma_migrations"
AS RESTRICTIVE
FOR INSERT
TO postgres
WITH CHECK (true);

CREATE policy "Enable select for postgres admin only"
ON "public"."_prisma_migrations"
AS RESTRICTIVE
FOR SELECT
TO postgres
USING (true);

CREATE policy "Enable update for postgres admin only"
ON "public"."_prisma_migrations"
AS RESTRICTIVE
FOR UPDATE
TO postgres
USING (true);

CREATE policy "Enable delete for postgres admin only"
ON "public"."_prisma_migrations"
AS RESTRICTIVE
FOR DELETE
TO postgres
USING (true);
