create policy "Enable users to view their own data only"
on "public"."users"
for SELECT
to authenticated
using (
  (select auth.uid()) = auth_id
);

create policy "Enable insert for authenticated users only"
on "public"."users"
for INSERT
to authenticated
with check (
  (select auth.uid()) = auth_id
);

create policy "Enable users to update their own records only" 
on "public"."users" 
for UPDATE 
to authenticated 
using (
  (select auth.uid()) = auth_id
)
with check (
  (select auth.uid()) = auth_id
);
