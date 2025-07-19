-- Create Schema extensions if not exists
CREATE SCHEMA IF NOT EXISTS extensions;

-- Enable the "pg_jsonschema" extension if not exists
create extension IF NOT EXISTS pg_jsonschema with schema extensions;

ALTER TABLE public.stage_configs
ADD CONSTRAINT check_walls CHECK (
    jsonb_matches_schema(
        '{
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "x": {
                        "type": "integer"
                    },
                    "y": {
                        "type": "integer"
                    },
                    "direction": {
                        "enum": ["N", "E", "S", "W"]
                    }
                },
                "required": ["x", "y", "direction"]
            },
            "uniqueItems": true
        }',
        walls
    )
);

ALTER TABLE public.stage_configs
ADD CONSTRAINT check_entry CHECK (
    jsonb_matches_schema(
        '{
            "type": "object",
            "properties": {
                "x": {
                    "type": "integer"
                },
                "y": {
                    "type": "integer"
                },
                "direction": {
                    "enum": ["N", "E", "S", "W"]
                }
            },
            "required": ["x", "y", "direction"]
        }',
        entry
    )
);