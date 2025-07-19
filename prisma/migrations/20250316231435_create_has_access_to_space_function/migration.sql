CREATE OR REPLACE FUNCTION secure_functions.has_access_to_space(target_space_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        -- 1. 当前用户拥有的空间
        SELECT 1
        FROM spaces
        WHERE id = target_space_id
          AND owner_id = (SELECT id FROM users WHERE auth_id = (SELECT auth.uid()))

        UNION

        -- 2. 当前用户加入的空间
        SELECT 1
        FROM _users_joined_spaces
        WHERE "A" = target_space_id
          AND "B" = (SELECT id FROM users WHERE auth_id = (SELECT auth.uid()))
    );
END;
$$;
