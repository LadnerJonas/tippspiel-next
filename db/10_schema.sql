drop table if exists Bet CASCADE ;
drop table if exists CommunityMember CASCADE;
drop table if exists Community CASCADE;
drop table if exists PinnedUser CASCADE;
drop table if exists Game CASCADE;
drop table if exists "User" CASCADE;

-- Create the "User" table
CREATE TABLE "User" (
                        id SERIAL PRIMARY KEY,
                        username VARCHAR(255) UNIQUE NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create TABLE PinnedUser (
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

Create TABLE CommunityMember (
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
            WHEN NEW.home_score = home_team_goals AND NEW.away_score = away_team_goals THEN 8  -- Exact match
            WHEN NEW.home_score - NEW.away_score = home_team_goals - away_team_goals THEN 6    -- Correct goal difference
            WHEN (NEW.home_score > NEW.away_score AND home_team_goals > away_team_goals) OR
                 (NEW.home_score = NEW.away_score AND home_team_goals = away_team_goals) OR
                 (NEW.home_score < NEW.away_score AND home_team_goals < away_team_goals) THEN 4 -- Correct tendency
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
CREATE VIEW CommunityUserScores AS
SELECT CM.community_id,
       CM.user_id,
       U.username,
       COALESCE(SUM(B.points_earned), 0) AS total_score
FROM CommunityMember CM
         JOIN "User" U ON CM.user_id = U.id
         LEFT JOIN Bet B ON CM.user_id = B.user_id
GROUP BY CM.community_id, CM.user_id, U.username;

-- Create the view for Community Leaderboards for all users
CREATE OR REPLACE VIEW  CommunityLeaderboard_AllUsers AS
WITH RankedUsers AS (
    SELECT
        CM.community_id,
        CM.user_id,
        U.username,
        COALESCE(SUM(B.points_earned), 0) AS total_score,
        RANK() OVER (PARTITION BY CM.community_id ORDER BY COALESCE(SUM(B.points_earned), 0) DESC, U.created_at) AS rank
    FROM
        CommunityMember CM
            JOIN "User" U ON CM.user_id = U.id
            LEFT JOIN Bet B ON CM.user_id = B.user_id
    GROUP BY
        CM.community_id,
        CM.user_id,
        U.username,
        U.created_at
)
SELECT
    RU.community_id,
    RU.user_id,
    RU.username,
    RU.total_score,
    RU.rank
FROM
    RankedUsers RU;

-- Create a function to generate the sneak preview of Community Leaderboards
-- DROP IF EXISTS FUNCTION generate_sneak_preview_leaderboard(integer,integer);
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
        WITH RankedUsers AS (
            SELECT
                CM.user_id,
                U.username,
                CAST(COALESCE(SUM(B.points_earned), 0) AS INT) AS total_points,
                CAST(ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(B.points_earned), 0) DESC, U.created_at, username) AS INT) AS ranked_user_position,
                CAST(RANK() OVER (ORDER BY COALESCE(SUM(B.points_earned), 0) DESC, U.created_at) AS INT) AS rank
            FROM
                CommunityMember CM
                    JOIN "User" U ON CM.user_id = U.id
                    LEFT JOIN Bet B ON CM.user_id = B.user_id
            WHERE
                CM.community_id = p_community_id
            GROUP BY
                CM.user_id,
                U.username,
                U.created_at
        ),
             UserPosition AS (
                 SELECT
                     user_id,
                     username,
                     total_points,
                     ranked_user_position,
                     rank
                 FROM
                     RankedUsers
                 WHERE
                     user_id = logged_in_user_id
             ),
             MaxPosition AS (
                 SELECT CAST(MAX(ranked_user_position) AS INT) AS max_rup FROM RankedUsers
             ),
             PreviewUsers AS (
                 /* logged in user */
                 SELECT * FROM UserPosition
                 UNION DISTINCT
                 /* first three and last user */
                 SELECT *
                 FROM RankedUsers RU
                 WHERE RU.ranked_user_position <= 3 OR RU.ranked_user_position = (SELECT max_rup FROM MaxPosition)
                 UNION DISTINCT
                 /* above and below user of logged in user and outside above query */
                 SELECT *
                 FROM RankedUsers RU
                 WHERE (SELECT ranked_user_position FROM UserPosition) >= 5 AND (SELECT ranked_user_position FROM UserPosition) <= (SELECT max_rup - 2 FROM MaxPosition)
                   AND ABS(RU.ranked_user_position - (SELECT ranked_user_position FROM UserPosition)) = 1
                 UNION DISTINCT
                 /* logged in user in top 4 */
                 SELECT *
                 FROM RankedUsers RU
                 WHERE (SELECT ranked_user_position FROM UserPosition) <= 4 AND RU.ranked_user_position <= 6
                 UNION DISTINCT
                 /* logged in user in last two place */
                 SELECT *
                 FROM RankedUsers RU
                 WHERE (SELECT ranked_user_position FROM UserPosition) > (SELECT max_rup - 2 FROM MaxPosition)
                   AND RU.ranked_user_position >= (SELECT max_rup - 3 FROM MaxPosition)
                 UNION DISTINCT
                 /* less or equal 7 users */
                 SELECT *
                 FROM RankedUsers RU WHERE (SELECT max_rup FROM MaxPosition) <= 7
             )
        SELECT PU.username AS f_username,
               PU.total_points AS f_total_points,
               PU.ranked_user_position AS f_ranked_user_position,
               PU.rank AS f_rank
        FROM PreviewUsers PU
        ORDER BY ranked_user_position;
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

