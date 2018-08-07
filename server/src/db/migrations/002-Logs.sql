--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE LoginLog (
    user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    time    INTEGER NOT NULL
);

CREATE TABLE QueryLog (
    user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    time    INTEGER NOT NULL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE LoginLog;
DROP TABLE QueryLog;