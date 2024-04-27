'use client'
import React, {useState, useEffect} from 'react'
import {Input, Button, DatePicker} from '@nextui-org/react';
import {Game} from "../../types/prismaTypes";
import GamesTable from "../games/gamesTable";
import {useRouter} from "next/navigation";

type GameFormProps = {
    game: Game;
};

const GameForm: React.FC<GameFormProps> = ({game}) => {
    const router = useRouter();
    const [homeTeamGoals, setHomeTeamGoals] = useState<number>(game?.home_score ? game.home_score! : 0);
    const [awayTeamGoals, setAwayTeamGoals] = useState<number>(game?.away_score ? game.away_score! : 0);
    const [endTime, setEndTime] = useState<string>(game?.end_time ? new Date(game.end_time).toISOString() : new Date().toISOString());

    useEffect(() => {
        setHomeTeamGoals(game?.home_score ? game.home_score! : 0);
        setAwayTeamGoals(game?.away_score ? game.away_score! : 0);
        setEndTime(game?.end_time ? new Date(game.end_time).toISOString() : new Date().toISOString());
    }, [game]);

    const handleUpdateGame = async () => {
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

            const updatedGame = await response.json();
            //router.push("/game/" + updatedGame.id)
            console.log('Updated game:', updatedGame);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <GamesTable games={[game]} href={`/admin/game/${game.id}`}/>
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
            <Button size="lg" color="primary" onClick={handleUpdateGame}>Update Game</Button>
        </div>
    );
};

export default GameForm;