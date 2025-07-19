CREATE POLICY "Users can access users in owned or joined spaces"
on "public"."users"
for SELECT
to authenticated
USING (
    secure_functions.has_access_to_user(id)
);
