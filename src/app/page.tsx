import getUserFromSession from "../helper/UserSessionHelper";
import UpcomingGames from "../components/games/upcomingGames";
import SneakPreviewOfUser from "../components/communities/leaderboard/sneakPreviewsOfUser";

export default function Home() {
    const user = getUserFromSession();

    return (<div>
            <UpcomingGames href={"/bet/game/"}/>
            {user && <SneakPreviewOfUser user={user}/>}
    </div>
    )
}
