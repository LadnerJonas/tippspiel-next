import {Game} from "../../types/prismaTypes";
import React from "react";
import GamesTable from "./gamesTable";

export default async function Games() {
    const games: Game[] = await fetch(`http://${process.env.SERVER_ADDRESS}/api/game`).then(res => res.json());

    return (
        <div>
            <p className="text-3xl font-bold">Upcoming games</p>
            <GamesTable games={games}/>
        </div>
    )

}