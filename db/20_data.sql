-- Clear all tables
TRUNCATE "User", PinnedUser, Community, CommunityMember, Bet, Game RESTART IDENTITY;

-- Insert data into the Game table
INSERT INTO Game (id, home_team, away_team, start_time, end_time)
VALUES
    (0, 'Deutschland', 'Schottland', '2024-06-14 19:00:00', '2024-06-14 20:30:00'),
    (1, 'Ungarn', 'Schweiz', '2024-06-15 13:00:00', '2024-06-15 14:30:00'),
    (2, 'Spanien', 'Kroatien', '2024-06-15 16:00:00', '2024-06-15 17:30:00'),
    (3, 'Italien', 'Albanien', '2024-06-15 19:00:00', '2024-06-15 20:30:00'),
    (4, 'tbd', 'Niederlande', '2024-06-16 13:00:00', '2024-06-16 14:30:00'),
    (5, 'Slowenien', 'Dänemark', '2024-06-16 16:00:00', '2024-06-16 17:30:00'),
    (6, 'Serbien', 'England', '2024-06-16 19:00:00', '2024-06-16 20:30:00'),
    (7, 'Rumänien', 'tbd', '2024-06-17 13:00:00', '2024-06-17 14:30:00'),
    (8, 'Belgien', 'Slowakei', '2024-06-17 16:00:00', '2024-06-17 17:30:00'),
    (9, 'Österreich', 'Frankreich', '2024-06-17 19:00:00', '2024-06-17 20:30:00'),
    (10, 'Türkei', 'tbd', '2024-06-18 16:00:00', '2024-06-18 17:30:00'),
    (11, 'Portugal', 'Tschechische Republik', '2024-06-18 19:00:00', '2024-06-18 20:30:00'),
    (12, 'Kroatien', 'Albanien', '2024-06-19 13:00:00', '2024-06-19 14:30:00'),
    (13, 'Deutschland', 'Ungarn', '2024-06-19 16:00:00', '2024-06-19 17:30:00'),
    (14, 'Schottland', 'Schweiz', '2024-06-19 19:00:00', '2024-06-19 20:30:00'),
    (15, 'Slowenien', 'Serbien', '2024-06-20 13:00:00', '2024-06-20 14:30:00'),
    (16, 'Dänemark', 'England', '2024-06-20 16:00:00', '2024-06-20 17:30:00'),
    (17, 'Spanien', 'Italien', '2024-06-20 19:00:00', '2024-06-20 20:30:00'),
    (18, 'Slowakei', 'tbd', '2024-06-21 13:00:00', '2024-06-21 14:30:00'),
    (19, 'tbd', 'Österreich', '2024-06-21 16:00:00', '2024-06-21 17:30:00'),
    (20, 'Niederlande', 'Frankreich', '2024-06-21 19:00:00', '2024-06-21 20:30:00'),
    (21, 'tbd', 'Tschechische Republik', '2024-06-22 13:00:00', '2024-06-22 14:30:00'),
    (22, 'Türkei', 'Portugal', '2024-06-22 16:00:00', '2024-06-22 17:30:00'),
    (23, 'Belgien', 'Rumänien', '2024-06-22 19:00:00', '2024-06-22 20:30:00'),
    (24, 'Schottland', 'Ungarn', '2024-06-23 19:00:00', '2024-06-23 20:30:00'),
    (25, 'Schweiz', 'Deutschland', '2024-06-23 19:00:00', '2024-06-23 20:30:00'),
    (26, 'Albanien', 'Spanien', '2024-06-24 19:00:00', '2024-06-24 20:30:00'),
    (27, 'Kroatien', 'Italien', '2024-06-24 19:00:00', '2024-06-24 20:30:00'),
    (28, 'Niederlande', 'Österreich', '2024-06-25 16:00:00', '2024-06-25 17:30:00'),
    (29, 'Frankreich', 'tbd', '2024-06-25 16:00:00', '2024-06-25 17:30:00'),
    (30, 'England', 'Slowenien', '2024-06-25 19:00:00', '2024-06-25 20:30:00'),
    (31, 'Dänemark', 'Serbien', '2024-06-25 19:00:00', '2024-06-25 20:30:00'),
    (32, 'Slowakei', 'Rumänien', '2024-06-26 16:00:00', '2024-06-26 17:30:00'),
    (33, 'tbd', 'Belgien', '2024-06-26 16:00:00', '2024-06-26 17:30:00'),
    (34, 'tbd', 'Portugal', '2024-06-26 19:00:00', '2024-06-26 20:30:00'),
    (35, 'Tschechische Republik', 'Türkei', '2024-06-26 19:00:00', '2024-06-26 20:30:00'),
    (36, '2A', '2B', '2024-06-29 16:00:00', '2024-06-29 17:30:00'),
    (37, '1A', '2C', '2024-06-29 19:00:00', '2024-06-29 20:30:00'),
    (38, '1C', '3EDF', '2024-06-30 16:00:00', '2024-06-30 17:30:00'),
    (39, '1B', 'ADEF', '2024-06-30 19:00:00', '2024-06-30 20:30:00'),
    (40, '2D', '2E', '2024-07-01 16:00:00', '2024-07-01 17:30:00'),
    (41, '1F', '3ABC', '2024-07-01 19:00:00', '2024-07-01 20:30:00'),
    (42, '1E', 'ABCD', '2024-07-02 16:00:00', '2024-07-02 17:30:00'),
    (43, '1D', '2F', '2024-07-02 19:00:00', '2024-07-02 20:30:00'),
    (44, 'W39', 'W37', '2024-07-05 16:00:00', '2024-07-05 17:30:00'),
    (45, 'W41', 'W42', '2024-07-05 19:00:00', '2024-07-05 20:30:00'),
    (46, 'W40', 'W38', '2024-07-06 16:00:00', '2024-07-06 17:30:00'),
    (47, 'W43', 'W44', '2024-07-06 19:00:00', '2024-07-06 20:30:00'),
    (48, 'W45', 'W46', '2024-07-09 19:00:00', '2024-07-09 20:30:00'),
    (49, 'W47', 'W48', '2024-07-10 19:00:00', '2024-07-10 20:30:00'),
    (50, 'W49', 'W50', '2024-07-14 19:00:00', '2024-07-14 20:30:00');

-- Generate 2 million users
INSERT INTO "User" (username)
SELECT 'user' || generate_series(1, 2000000);

-- Create the "All Users" community
INSERT INTO Community (id, name)
VALUES (0, 'All Users');

-- Add all users to the "All Users" community
INSERT INTO CommunityMember (community_id, user_id)
SELECT 0, id FROM "User";

-- Generate some random pinned users for each user
-- Generate pinned users for each user
INSERT INTO PinnedUser (user_id, pinned_user_id)
SELECT
    U.id AS user_id,
    generate_series(U.id+1, U.id+5)::integer AS pinned_user_id
FROM
    "User" U limit 1000;

-- Generate some random communities
INSERT INTO Community (name)
SELECT 'Community ' || generate_series(1, 100);

-- Generate some random community members
-- TODO

-- Generate some random bets for each user
INSERT INTO Bet (user_id, game_id, home_team_goals, away_team_goals)
SELECT
    id AS user_id,
    (SELECT id FROM Game where random() < 0.30 AND created_at != game.end_time LIMIT 1),
    floor(random() * 5),
    floor(random() * 5)
FROM
    "User" CROSS JOIN generate_series(1, 3) limit 1000;

REFRESH MATERIALIZED VIEW UserTotalPoints;
REFRESH MATERIALIZED VIEW RankedUsersMV;