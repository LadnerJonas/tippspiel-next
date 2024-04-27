'use client'
import React, {useState, useEffect} from 'react'
import {Input, Button, Progress} from '@nextui-org/react';
import {Bet, Game} from "../../types/prismaTypes";
import GamesTable from "../games/gamesTable";
import {useRouter} from "next/navigation";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {tr} from "date-fns/locale";
import ToastComponent from "../common/ToastComponent";

type BetFormProps = {
    game: Game;
    bet: Bet;
};

const BetForm: React.FC<BetFormProps> = ({game, bet}) => {
    const router = useRouter();
    const [homeTeamGoals, setHomeTeamGoals] = useState<number>(bet?.home_team_goals ? bet.home_team_goals! : 0);
    const [awayTeamGoals, setAwayTeamGoals] = useState<number>(bet?.away_team_goals ? bet.away_team_goals! : 0);
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setHomeTeamGoals(bet?.home_team_goals ? bet.home_team_goals! : 0);
        setAwayTeamGoals(bet?.away_team_goals ? bet.away_team_goals! : 0);
    }, [bet]);

    const handleUpdateBet = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/bet/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: bet.id,
                    user_id: bet.user_id,
                    game_id: bet.game_id as number,
                    home_team_goals: homeTeamGoals,
                    away_team_goals: awayTeamGoals,
                }),
            });

            if (!response.ok) {
                throw new Error('Error updating bet');
            }

            const updatedBet = await response.json();
            ToastComponent({message: 'Bet updated successfully!', type: 'success'});
            router.push("/bet/" + updatedBet.id)
            console.log('Updated bet:', updatedBet);
        } catch (error) {
            ToastComponent({message: `Error updating bet: ${error.message}`, type: 'error'});
            console.error('Error:', error);
        }
        finally {
            setLoading(false)
        }
    };

    const handleDeleteBet = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/bet/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: bet.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Error deleting bet');
            }

            console.log("response: ", response.ok)
            if (response.ok) {
                ToastComponent({message: 'Bet deleted successfully!', type: 'success'});
                router.push("/bet")
            }
        } catch (error) {
            ToastComponent({message: `Error deleting bet: ${error.message}`, type: 'error'});
            console.error('Error:', error);
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <ToastContainer theme="dark"/>
            <GamesTable games={[game]} href={`bet/game/${game.id}`}/>
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
            {loading && <Progress
                size="sm"
                isIndeterminate
                aria-label="Loading..."
                hidden={!loading}
            />}
            {bet.id ?
                (<>
                        <Button size="lg" color="primary" onClick={handleUpdateBet} disabled={loading}>Update Bet</Button>
                        <Button size="lg" color="danger" onClick={handleDeleteBet} disabled={loading}>Delete Bet</Button></>
                )
                : (
                    <><Button size="lg" color="primary" onClick={handleUpdateBet} disabled={loading}>Create Bet</Button></>
                )
            }
        </div>
    );
};

export default BetForm;