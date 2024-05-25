WITH rankedusers AS (
  SELECT
    cm.community_id,
    cm.user_id,
    u.username,
    (COALESCE(sum(b.points_earned), (0) :: bigint)) :: integer AS total_score,
    (
      rank() OVER (
        PARTITION BY cm.community_id
        ORDER BY
          COALESCE(sum(b.points_earned), (0) :: bigint) DESC,
          u.created_at
      )
    ) :: integer AS rank
  FROM
    (
      (
        communitymember cm
        JOIN "User" u ON ((cm.user_id = u.id))
      )
      LEFT JOIN bet b ON ((cm.user_id = b.user_id))
    )
  GROUP BY
    cm.community_id,
    cm.user_id,
    u.username,
    u.created_at
)
SELECT
  community_id,
  user_id,
  username,
  total_score,
  rank
FROM
  rankedusers ru;