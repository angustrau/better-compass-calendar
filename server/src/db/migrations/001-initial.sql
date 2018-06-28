--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE AuthTokens (
    token         TEXT    PRIMARY KEY,
    expires       INTEGER NOT NULL,
    user_id       TEXT    NOT NULL,
    compass_token TEXT    NOT NULL
);

CREATE TABLE Users (
    id            INTEGER PRIMARY KEY,
    display_code  TEXT    NOT NULL,
    full_name     TEXT    NOT NULL,
    email         TEXT    NOT NULL
);

CREATE TABLE Locations (
    id         INTEGER PRIMARY KEY,
    full_name  TEXT    NOT NULL,
    short_name TEXT    NOT NULL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE AuthTokens;
DROP TABLE Users;
DROP TABLE Locations;