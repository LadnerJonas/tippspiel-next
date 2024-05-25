import {Bet} from "../../../types/prismaTypes";
import BetForm from "../../../components/bet/BetForm";

export default async function ExistingBetPage({params}: { params: { id: number } }) {
    const betResponse  = await fetch(`http://${process.env.SERVER_ADDRESS}/api/bet?bet_id=${params.id}`, {cache: 'no-store'})
    if (!betResponse.ok) {
        return <div>Error fetching bet</div>;
    }
    const bet = await betResponse.json() as Bet;
    const game = await fetch(`http://${process.env.SERVER_ADDRESS}/api/game/?id=${bet.game_id}`, {cache: "no-cache"}).then(response => response.json());

    return (
        <BetForm game={game} bet={bet}/>
    );

}