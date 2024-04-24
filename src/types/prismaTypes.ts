export type User = { id: number, username: string }
export type Community = { id: number, name: string }
export type Game = {
    id: number,
    home_team: string,
    away_team: string,
    start_time: Date,
    end_time: Date,
    home_score: number | null,
    away_score: number | null

}
export type SneakPreviewOfCommunityRow = {
    f_ranked_user_position: number,
    f_rank: number,
    f_username: string,
    f_total_points: number
}

export type Bet = {
    id: number | undefined
    user_id: number,
    game_id: number,
    home_team_goals: number | undefined,
    away_team_goals: number | undefined,
    points_earned: number | undefined
}