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
UPDATE Bet
SET points_earned =
        CASE
            WHEN NEW.home_team_goals = OLD.home_score AND NEW.away_team_goals = OLD.away_score THEN 8  -- Exact match
            WHEN NEW.home_team_goals - NEW.away_team_goals = OLD.home_score - OLD.away_score THEN 6    -- Correct goal difference
            WHEN (NEW.home_team_goals > NEW.away_team_goals AND OLD.home_score > OLD.away_score) OR
                 (NEW.home_team_goals = NEW.away_team_goals AND OLD.home_score = OLD.away_score) OR
                 (NEW.home_team_goals < NEW.away_team_goals AND OLD.home_score < OLD.away_score) THEN 4 -- Correct tendency
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
    BEFORE INSERT ON Bet
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
CREATE VIEW CommunityLeaderboard_AllUsers AS
WITH RankedUsers AS (
    SELECT
        CM.community_id,
        CM.user_id,
        U.username,
        COALESCE(SUM(B.points_earned), 0) AS total_score,
        RANK() OVER (PARTITION BY CM.community_id ORDER BY COALESCE(SUM(B.points_earned), 0) DESC) AS rank
    FROM
        CommunityMember CM
            JOIN "User" U ON CM.user_id = U.id
            LEFT JOIN Bet B ON CM.user_id = B.user_id
    GROUP BY
        CM.community_id,
        CM.user_id,
        U.username
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
CREATE OR REPLACE FUNCTION generate_sneak_preview_leaderboard(logged_in_user_id INT, p_community_id INT)
    RETURNS TABLE (
                      username VARCHAR(255),
                      total_points INT,
                      rank INT
                  ) AS
$$
BEGIN
    RETURN QUERY
        WITH RankedUsers AS (
            SELECT
                CM.user_id,
                U.username,
                COALESCE(SUM(B.points_earned), 0) AS total_points,
                RANK() OVER (ORDER BY COALESCE(SUM(B.points_earned), 0) DESC, U.created_at) AS rank
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
             UserRank AS (
                 SELECT rank
                 FROM RankedUsers
                 WHERE user_id = logged_in_user_id
             )
        SELECT
            RU.username,
            RU.total_points,
            RU.rank
        FROM
            RankedUsers RU
        WHERE
            RU.rank <= 3 -- Show the top 3 users
           OR RU.user_id = logged_in_user_id -- Show the currently logged-in user
           OR RU.rank = (SELECT rank FROM UserRank) - 1 -- Show the user before the logged-in user
           OR RU.rank = (SELECT rank FROM UserRank) + 1 -- Show the user after the logged-in user
           OR RU.rank = (SELECT MAX(rank) FROM RankedUsers) -- Show the user in last place
        UNION ALL
        (SELECT
             username,
             total_points,
             rank
         FROM
             RankedUsers
         WHERE
             rank > (SELECT MIN(rank) FROM UserRank) - 2 AND rank < (SELECT MAX(rank) FROM UserRank) + 2
         ORDER BY
             rank
         LIMIT
             7 - (SELECT COUNT(*) FROM RankedUsers WHERE rank <= 3)); -- Ensure at least 7 users are shown
END;
$$
    LANGUAGE plpgsql;

