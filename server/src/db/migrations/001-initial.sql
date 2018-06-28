--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE Users (
    id            INTEGER PRIMARY KEY,
    display_code  TEXT    NOT NULL,
    full_name     TEXT    NOT NULL,
    email         TEXT    NOT NULL
);

CREATE TABLE AuthTokens (
    token         TEXT    PRIMARY KEY,
    expires       INTEGER NOT NULL,
    user_id       TEXT    NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    compass_token TEXT    NOT NULL
);

CREATE TABLE Activities (
    id     INTEGER PRIMARY KEY,
    "name" TEXT    NOT NULL
);

CREATE TABLE Locations (
    id         INTEGER PRIMARY KEY,
    full_name  TEXT    NOT NULL,
    short_name TEXT    NOT NULL
);

CREATE TABLE Events (
    id          TEXT    PRIMARY KEY,
    title       TEXT    NOT NULL,
    desciption  TEXT    NOT NULL,
    activity_id INTEGER NOT NULL REFERENCES Activities(id) ON DELETE CASCADE,
    location_id INTEGER NOT NULL REFERENCES Locations(id) ON DELETE CASCADE,
    manager_id  INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    all_day     INTEGER NOT NULL,
    start_time  INTEGER NOT NULL,
    end_time    INTEGER NOT NULL
);

CREATE TABLE Subscriptions (
    user_id     INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    activity_id INTEGER NOT NULL REFERENCES Activities(id) ON DELETE CASCADE
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE Users;
DROP TABLE AuthTokens;
DROP TABLE Activities;
DROP TABLE Locations;
DROP TABLE Events;
DROP TABLE Subscriptions;
