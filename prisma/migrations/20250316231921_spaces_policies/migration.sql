DROP POLICY IF EXISTS "Enable users to view the spaces they are members of" ON public.spaces;

CREATE POLICY "Users can access owned or joined spaces"
on "public"."spaces"
as PERMISSIVE
for SELECT
to authenticated
USING (
    secure_functions.has_access_to_space(id)
);
