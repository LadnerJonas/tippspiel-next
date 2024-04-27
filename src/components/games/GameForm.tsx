'use client'
import React, {useEffect, useState} from 'react'
import {Button, Input, Progress} from '@nextui-org/react';
import {Game} from "../../types/prismaTypes";
import GamesTable from "../games/gamesTable";
import ToastComponent from "../common/ToastComponent";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {notifyClients} from "../../pages/api/old-websocket";
import {useWebSocket, WebSocketProvider} from "next-ws/client";

type GameFormProps = {
    game: Game;
};

const GameForm: React.FC<GameFormProps> = ({game}) => {
    const ws = useWebSocket();

    const [homeTeamGoals, setHomeTeamGoals] = useState<number>(game?.home_score ? game.home_score! : 0);
    const [awayTeamGoals, setAwayTeamGoals] = useState<number>(game?.away_score ? game.away_score! : 0);
    const [endTime, setEndTime] = useState<string>(game?.end_time ? new Date(game.end_time).toISOString() : new Date().toISOString());
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setHomeTeamGoals(game?.home_score ? game.home_score! : 0);
        setAwayTeamGoals(game?.away_score ? game.away_score! : 0);
        setEndTime(game?.end_time ? new Date(game.end_time).toISOString() : new Date().toISOString());
    }, [game]);

    const handleUpdateGame = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/game/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: game.id,
                    home_score: homeTeamGoals,
                    away_score: awayTeamGoals,
                    end_time: endTime,
                }),
            });

            if (!response.ok) {
                throw new Error('Error updating game');
            }
            ToastComponent({message: 'Game updated successfully!', type: 'success'});
            ws?.send("Game updated");
            console.log("send")
        } catch (error) {
            ToastComponent({message: `Error updating game: ${error.message}`, type: 'error'});
            console.error('Error:', error);
        }
        finally {
            setLoading(false)
        }
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <ToastContainer theme="dark"/>
            <GamesTable initialGames={[game]} href={`/admin/game/${game.id}`}/>
            <Input
                type="number"
                value={homeTeamGoals.toString()}
                onChange={(e) => setHomeTeamGoals(Number(e.target.value))}
                placeholder="Home team goals"
                label={"Home team goals"}
            />
            <Input
                type="number"
                value={awayTeamGoals.toString()}
                onChange={(e) => setAwayTeamGoals(Number(e.target.value))}
                placeholder="Away team goals"
                label={"Away team goals"}
            />
            <Input
                type={"text"}
                value={endTime}
                onChange={(date) => setEndTime(date.target.value)}
                placeholder="End time"
                label={"End time"}
            />
            {loading && <Progress
                size="sm"
                isIndeterminate
                aria-label="Loading..."
                hidden={!loading}
            />}
            <Button size="lg" color="primary" onClick={handleUpdateGame} disabled={loading}>Update Game</Button>
        </div>
    );
};

export default GameForm;