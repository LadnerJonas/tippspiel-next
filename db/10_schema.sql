DROP TABLE IF EXISTS Bet CASCADE;
DROP TABLE IF EXISTS CommunityMember CASCADE;
DROP TABLE IF EXISTS Community CASCADE;
DROP TABLE IF EXISTS PinnedUser CASCADE;
DROP TABLE IF EXISTS Game CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Create the "User" table
CREATE TABLE "User" (
                        id SERIAL PRIMARY KEY,
                        username VARCHAR(255) UNIQUE NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PinnedUser (
                            user_id INT REFERENCES "User"(id),
                            pinned_user_id INT REFERENCES "User"(id),
                            PRIMARY KEY (user_id, pinned_user_id)
);

-- Create the Community table
CREATE TABLE Community (
                           id SERIAL PRIMARY KEY,
                           name VARCHAR(255) NOT NULL,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the CommunityMember table
CREATE TABLE CommunityMember (
                                 id SERIAL PRIMARY KEY,
                                 community_id INT REFERENCES Community(id),
                                 user_id INT REFERENCES "User"(id)
);

-- Create the Game table
CREATE TABLE Game (
                      id SERIAL PRIMARY KEY,
                      home_team VARCHAR(255) NOT NULL,
                      away_team VARCHAR(255) NOT NULL,
                      start_time TIMESTAMP NOT NULL,
                      end_time TIMESTAMP NOT NULL,
                      home_score INT,
                      away_score INT,
                      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Bet table
CREATE TABLE Bet (
                     id SERIAL PRIMARY KEY,
                     user_id INT REFERENCES "User"(id),
                     game_id INT REFERENCES Game(id),
                     home_team_goals INT,
                     away_team_goals INT,
                     points_earned INT DEFAULT 0, -- Set default value for points_earned
                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a function to calculate and update points_earned in Bet table
CREATE OR REPLACE FUNCTION update_bet_points()
    RETURNS TRIGGER AS $$
BEGIN
    -- Calculate points_earned based on the difference between home_score and away_score
    UPDATE Bet b
    SET points_earned =
            CASE
                WHEN NEW.home_score = b.home_team_goals AND NEW.away_score = b.away_team_goals THEN 8  -- Exact match
                WHEN NEW.home_score - NEW.away_score = b.home_team_goals - b.away_team_goals THEN 6    -- Correct goal difference
                WHEN (NEW.home_score > NEW.away_score AND b.home_team_goals > b.away_team_goals) OR
                     (NEW.home_score = NEW.away_score AND b.home_team_goals = b.away_team_goals) OR
                     (NEW.home_score < NEW.away_score AND b.home_team_goals < b.away_team_goals) THEN 4 -- Correct tendency
                ELSE 0 -- Incorrect bet
                END
    WHERE game_id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update points_earned in Bet table
CREATE TRIGGER update_bet_points_trigger
    AFTER UPDATE OF home_score, away_score ON Game
    FOR EACH ROW
EXECUTE FUNCTION update_bet_points();

-- Create a trigger to prevent bets after the game has started
CREATE OR REPLACE FUNCTION check_bet_before_game_start()
    RETURNS TRIGGER AS $$
BEGIN
    IF NEW.created_at > (SELECT start_time FROM Game WHERE id = NEW.game_id) THEN
        RAISE EXCEPTION 'Bet cannot be placed after the game has started!';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_bet_before_game_start_trigger
    BEFORE INSERT OR UPDATE ON Bet
    FOR EACH ROW
EXECUTE FUNCTION check_bet_before_game_start();

-- Create the view to get the total score of each user in a community
CREATE MATERIALIZED VIEW UserTotalPoints AS
SELECT
    u.id AS user_id,
    u.username,
    CAST(COALESCE(SUM(B.points_earned), 0) AS INT) AS total_points
FROM
    "User" u
        LEFT JOIN
    Bet b ON u.id = b.user_id
GROUP BY
    u.id, u.username;

-- Create a trigger to update the materialized view on each transaction
CREATE OR REPLACE FUNCTION refresh_user_total_points()
    RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW UserTotalPoints;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE MATERIALIZED VIEW RankedUsersMV AS
SELECT
    CM.community_id,
    CM.user_id,
    U.username,
    COALESCE(UT.total_points, 0) AS total_points,
    CAST (ROW_NUMBER() OVER (PARTITION BY CM.community_id ORDER BY COALESCE(UT.total_points, 0) DESC, U.created_at, U.username) AS INT) AS ranked_user_position,
    CAST (RANK() OVER (PARTITION BY CM.community_id ORDER BY COALESCE(UT.total_points, 0) DESC, U.created_at) AS INT) AS rank
FROM
    CommunityMember CM
        JOIN
    "User" U ON CM.user_id = U.id
        LEFT JOIN
    UserTotalPoints UT ON CM.user_id = UT.user_id
ORDER BY ranked_user_position;

-- Create an index on RankedUsersMV for better performance
CREATE INDEX idx_ranked_users_mv_user_id ON RankedUsersMV(user_id,ranked_user_position);

CREATE OR REPLACE VIEW CommunityLeaderboard_AllUsers AS
SELECT
    RU.username,
    RU.total_points,
    RU.rank
FROM
    RankedUsersMV RU;

-- Create a trigger to refresh the materialized view on changes to UserTotalPoints
CREATE OR REPLACE FUNCTION refresh_ranked_users_mv()
    RETURNS TRIGGER AS
$$
BEGIN
    REFRESH MATERIALIZED VIEW UserTotalPoints;
    REFRESH MATERIALIZED VIEW RankedUsersMV;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_user_total_points_and_refresh_ranked_users_mv()
RETURNS trigger AS $$
BEGIN
    PERFORM refresh_user_total_points();
    PERFORM refresh_ranked_users_mv();
END; $$
    LANGUAGE plpgsql;

CREATE TRIGGER update_user_total_points_trigger
    AFTER UPDATE OF points_earned ON Bet
EXECUTE FUNCTION refresh_ranked_users_mv();

-- Create a function to generate the sneak preview of Community Leaderboards
CREATE OR REPLACE FUNCTION generate_sneak_preview_leaderboard(p_community_id INT, logged_in_user_id INT)
    RETURNS TABLE (
                      f_username VARCHAR(255),
                      f_total_points INT,
                      f_ranked_user_position INT,
                      f_rank INT
                  )
AS
$$
BEGIN
    RETURN QUERY
        WITH
            RankedUsersMVOfCommunity AS (
                SELECT *
                FROM RankedUsersMV RU
                WHERE RU.community_id = p_community_id
            ),
            UserPosition AS (
            SELECT *
            FROM
                RankedUsersMVOfCommunity
            WHERE
                user_id = logged_in_user_id
            limit 1
        ),
             MaxPosition AS (
                 SELECT MAX(ranked_user_position) AS max_rup FROM RankedUsersMV WHERE community_id = p_community_id limit 1
             ),
             PreviewUsers AS (
                 /* logged in user */
                 SELECT * FROM UserPosition
                 UNION
                 /* first three and last user */
                 SELECT *
                 FROM RankedUsersMVOfCommunity RUOC
                 WHERE (RUOC.ranked_user_position <= 3 OR RUOC.ranked_user_position = (SELECT max_rup FROM MaxPosition))
                    OR ((SELECT ranked_user_position FROM UserPosition) >= 5 AND
                        (SELECT ranked_user_position FROM UserPosition) <= (SELECT max_rup - 2 FROM MaxPosition)
                     AND ABS(RUOC.ranked_user_position - (SELECT ranked_user_position FROM UserPosition)) = 1)
                    OR ((SELECT ranked_user_position FROM UserPosition) <= 4 AND RUOC.ranked_user_position <= 6)
                    OR ((SELECT ranked_user_position FROM UserPosition) > (SELECT max_rup - 2 FROM MaxPosition)
                     AND RUOC.ranked_user_position >= (SELECT max_rup - 3 FROM MaxPosition))
                    OR ((SELECT max_rup FROM MaxPosition) <= 7)
             )
        SELECT DISTINCT on (ranked_user_position)
            PU.username AS f_username,
            PU.total_points AS f_total_points,
            PU.ranked_user_position AS f_ranked_user_position,
            PU.rank AS f_rank
        FROM
            PreviewUsers PU
        ORDER BY
            ranked_user_position
        limit 7;
END;
$$
    LANGUAGE plpgsql;


-- Indexes for faster retrieval
-- Create index on User.id and User.username
CREATE INDEX idx_user_id_username ON "User"(id, username);

-- Create index on CommunityMember.user_id
CREATE INDEX idx_community_member_user_id ON CommunityMember(user_id);

-- Create index on Bet.user_id
CREATE INDEX idx_bet_user_id ON Bet(user_id);

-- Create index on Bet.game_id
CREATE INDEX idx_bet_game_id ON Bet(game_id);

CREATE INDEX idx_ranked_users_mv_community_id ON RankedUsersMV(community_id,ranked_user_position);
