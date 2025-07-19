ALTER TABLE user_space_mediasoup DROP CONSTRAINT IF EXISTS unique_user_space;

-- Add unique constraint
ALTER TABLE user_space_mediasoup
ADD CONSTRAINT unique_user_space UNIQUE (user_id, space_id);
