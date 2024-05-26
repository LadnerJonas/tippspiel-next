import getUserFromSession from "../../helper/UserSessionHelper";
import GamesTable from "../../components/games/gamesTable";
import BetTable from "../../components/bet/BetTable";

export default async function Bets() {
    const user = getUserFromSession();
    const betsWithGames = await fetch(`http://${process.env.SERVER_ADDRESS}/api/user/bet?user_id=${user!.id}`, {cache: "no-cache"}).then(res => res.json());

    return (
        <div>
            <p className="text-3xl">Bets</p>
            {betsWithGames.length > 0 ? betsWithGames.sort((x,y) => x.id - y.id).map(x => (
                    <div key={x.id}>
                        <p className="text-2xl ">Your Bet #{x.id}</p>
                        <GamesTable initialGames={[x.game]} href={`/bet/game/${x.id}`}/>
                        <div style={{paddingBottom: "3px"}}></div>
                        <BetTable x={x}/>
                        <br/>
                    </div>))
                :
                <div>No bets found</div>
            }
        </div>
    )
}