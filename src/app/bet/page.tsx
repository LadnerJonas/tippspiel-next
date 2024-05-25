import getUserFromSession from "../../helper/UserSessionHelper";
import GamesTable from "../../components/games/gamesTable";
import BetTable from "../../components/bet/BetTable";

export default async function Bets() {
    const user = getUserFromSession();
    const betsWithGames = await fetch(`http://${process.env.SERVER_ADDRESS}/api/user/bet?user_id=${user!.id}`, {cache: "no-cache"}).then(res => res.json());

    return (
        <div>
            <p className="text-3xl font-bold">Bets</p>
            {betsWithGames.length > 0 ? betsWithGames.map(x => (
                    <div key={x.id}>
                        <p className="text-xl font-bold">Your Bet</p>
                        <GamesTable initialGames={[x.game]} href={`/bet/game/${x.id}`}/>
                        <BetTable x={x}/>
                    </div>))
                :
                <div>No bets found</div>
            }
        </div>
    )
}