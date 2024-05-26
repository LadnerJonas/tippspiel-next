'use client'
import UpcomingGames from "../../components/games/upcomingGames";

export default function Page() {
    return (
        <div>
            <p className={"text-3xl"}>Admin Page</p>
            <UpcomingGames href={"/admin/game/"}/>
        </div>
    );
}