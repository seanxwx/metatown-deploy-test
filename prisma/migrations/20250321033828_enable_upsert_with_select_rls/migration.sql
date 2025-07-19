CREATE OR REPLACE FUNCTION secure_functions.has_access_to_space(target_space_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- 如果不存在，返回 TRUE，这样 UPSERT 的 SELECT 就不会被 RLS 拦截。
    IF NOT EXISTS (SELECT 1 FROM spaces WHERE id = target_space_id) THEN
        RETURN TRUE;
    END IF;
    
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

CREATE OR REPLACE FUNCTION secure_functions.has_access_to_user(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- 如果不存在，返回 TRUE，这样 UPSERT 的 SELECT 就不会被 RLS 拦截。
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = target_user_id) THEN
        RETURN TRUE;
    END IF;

    -- 判断当前用户是否拥有或加入了与 target_user_id 相关的空间
    RETURN EXISTS (
        -- 1. 当前用户拥有的空间中是否存在 target_user_id
        SELECT 1
        FROM spaces s
        JOIN _users_joined_spaces ujs ON s.id = ujs."A"
        WHERE s.owner_id = (SELECT id FROM users WHERE auth_id = (SELECT auth.uid()))
          AND ujs."B" = target_user_id

        UNION

        -- 2. 当前用户加入的空间中是否存在 target_user_id
        SELECT 1
        FROM _users_joined_spaces ujs1
        JOIN _users_joined_spaces ujs2 ON ujs1."A" = ujs2."A"
        WHERE ujs1."B" = (SELECT id FROM users WHERE auth_id = (SELECT auth.uid()))
          AND ujs2."B" = target_user_id

        UNION

        -- 3. 当前用户加入的空间的拥有者是否为 target_user_id
        SELECT 1
        FROM spaces s
        JOIN _users_joined_spaces ujs ON s.id = ujs."A"
        WHERE ujs."B" = (SELECT id FROM users WHERE auth_id = (SELECT auth.uid()))
          AND s.owner_id = target_user_id
    );
END;
$$;
