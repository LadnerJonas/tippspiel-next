'use client'
import React, { useState, useEffect } from 'react'
import { Input, Button } from '@nextui-org/react';
import {Bet, Game} from "../../types/prismaTypes";
import GamesTable from "../games/gamesTable";

type BetFormProps = {
    game: Game;
    bet: Bet;
};

const BetForm: React.FC<BetFormProps> = ({ game,bet }) => {
    const [homeTeamGoals, setHomeTeamGoals] = useState<number>(bet?.home_team_goals ? bet.home_team_goals! : 0);
    const [awayTeamGoals, setAwayTeamGoals] = useState<number>(bet?.away_team_goals ? bet.away_team_goals! : 0);

    useEffect(() => {
        setHomeTeamGoals(bet?.home_team_goals  ? bet.home_team_goals! : 0);
        setAwayTeamGoals(bet?.away_team_goals  ? bet.away_team_goals! : 0);
    }, [bet]);

    const handleUpdateBet = async () => {
        try {
            const response = await fetch(`/api/bet/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: bet.id,
                    user_id : bet.user_id,
                    game_id : bet.game_id as number,
                    home_team_goals: homeTeamGoals,
                    away_team_goals: awayTeamGoals,
                }),
            });

            if (!response.ok) {
                throw new Error('Error updating bet');
            }

            const updatedBet = await response.json();
            console.log('Updated bet:', updatedBet);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <GamesTable games={[game]} />
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
            <Button onClick={handleUpdateBet}>Update Bet</Button>
        </div>
    );
};

export default BetForm;