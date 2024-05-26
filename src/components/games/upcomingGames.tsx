'use client'
import {Game} from "../../types/prismaTypes";
import {getAllUpcomingGames} from "../../helper/GameFetcher";
import GamesTableWrapper from "./GamesTableWrapper";


export default async function Games({href}: { href: string }) {
    const games: Game[] = await getAllUpcomingGames();

    return (
        <div>
            <p className="text-3xl">Upcoming games</p>
            <p>{href.indexOf("/admin") !== -1 ? "Here you can edit the current state of all games. Just click on the game to edit." : "Here you can see all the upcoming games."}</p>
            <GamesTableWrapper initialGames={games} href={href}/>
            <br/>
        </div>
    )
}