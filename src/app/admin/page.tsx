'use client'
import UpcomingGames from "../../components/games/upcomingGames";

export default function Page() {
    return (
        <div>
            <h1>Admin Page</h1>
            <UpcomingGames href={"/admin/game/"}/>
        </div>
    );
}