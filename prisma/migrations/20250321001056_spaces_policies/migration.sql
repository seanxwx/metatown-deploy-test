alter policy "Enable users to insert spaces"
on "public"."spaces"
to authenticated
with check (
    secure_functions.is_current_user(owner_id)
);

alter policy "Enable users to update their own spaces"
on "public"."spaces"
to authenticated
using (
    secure_functions.is_space_owner(id)
)
with check (
    secure_functions.is_space_owner(id)
);

alter policy "Enable users to delete their own spaces"
on "public"."spaces"
to authenticated
using (
    secure_functions.is_space_owner(id)
);
