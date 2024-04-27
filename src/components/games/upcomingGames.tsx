'use client'
import {Game} from "../../types/prismaTypes";
import {getAllUpcomingGames} from "../../helper/GameFetcher";
import GamesTableWrapper from "./GamesTableWrapper";


export default async function Games({href}: { href: string }) {
    const games: Game[] = await getAllUpcomingGames();

    return (
        <div>
            <p className="text-3xl font-bold">Upcoming games</p>
            <GamesTableWrapper initialGames={games} href={href}/>
        </div>
    )
}