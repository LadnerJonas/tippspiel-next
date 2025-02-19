'use client'
import GameForm from "./GameForm";
import dynamic from "next/dynamic";
import {WebSocketProvider} from "next-ws/client";

export function GameFormWrapper({ game }) {
    return (
        <WebSocketProvider url={`ws://localhost:5173/ws`}>
            <GameForm game={game}/>
        </WebSocketProvider>
    )
}

export default dynamic(() => Promise.resolve(GameFormWrapper), {
    ssr: false,
});