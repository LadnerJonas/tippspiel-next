import {Bet} from "../../../../types/prismaTypes";
import BetForm from "../../../../components/bet/BetForm";
import getUserFromSession from "../../../../helper/UserSessionHelper";

export default async function ExistingBetPage({params}: { params: { id: number } }) {
    const user = getUserFromSession();
    const betResponse  = await fetch(`http://${process.env.SERVER_ADDRESS}/api/game/bet?game_id=${params.id}&user_id=${user!.id}`, {cache: 'no-store'})

    const game_id = Number(params.id);
    const game = await fetch(`http://${process.env.SERVER_ADDRESS}/api/game/?id=${game_id}`).then(response => response.json());

    let bet: Bet;
    if (!betResponse.ok) {
        bet = {
            id: undefined,
            user_id: user!.id,
            game_id: game_id,
            home_team_goals: 0,
            away_team_goals: 0,
            points_earned: undefined
        }
    }else{
        bet = await betResponse.json() as Bet;
    }

    return (
        <BetForm game={game} bet={bet}/>
    );

}