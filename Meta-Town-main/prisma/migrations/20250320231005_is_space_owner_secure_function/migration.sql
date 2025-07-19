CREATE OR REPLACE FUNCTION secure_functions.is_space_owner(target_space_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM spaces
        WHERE spaces.id = target_space_id
          AND spaces.owner_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    );
END;
$$;

CREATE OR REPLACE FUNCTION secure_functions.is_current_user(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN user_id = (SELECT id FROM users WHERE auth_id = auth.uid());
END;
$$;
