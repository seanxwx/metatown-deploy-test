create policy "Enable users to view their own spaces"
on "public"."spaces"
as PERMISSIVE
for SELECT
to authenticated
using (
  (select auth.uid()) = (select auth_id from users where id = owner_id)
);

create policy "Enable users to view the spaces they are members of"
on "public"."spaces"
as PERMISSIVE
for SELECT
to authenticated
using (
   (EXISTS ( SELECT 1
   FROM (_users_joined_spaces
     LEFT JOIN users ON ((users.id = _users_joined_spaces."B")))
  WHERE ((_users_joined_spaces."A" = spaces.id) AND (users.auth_id = ( SELECT auth.uid() AS uid)))))
);

create policy "Enable users to insert spaces"
on "public"."spaces"
for INSERT
to authenticated
with check (
  (select auth.uid()) = (select auth_id from users where id = owner_id)
);

create policy "Enable users to update their own spaces"
on "public"."spaces"
for UPDATE
to authenticated
using (
  (select auth.uid()) = (select auth_id from users where id = owner_id)
)
with check (
  (select auth.uid()) = (select auth_id from users where id = owner_id)
);

create policy "Enable users to delete their own spaces"
on "public"."spaces"
for DELETE
to authenticated
using (
  (select auth.uid()) = (select auth_id from users where id = owner_id)
)