import {WebSocketProvider} from "next-ws/client";
import GamesTable from "./gamesTable";
import dynamic from "next/dynamic";

export function GamesTableWrapper({initialGames, href}) {
    return (
        <WebSocketProvider
            url="ws://localhost:5173/ws">
            <GamesTable initialGames={initialGames} href={href}/>
        </WebSocketProvider>
    )
}
export default dynamic(() => Promise.resolve(GamesTableWrapper), {
    ssr: false,
});