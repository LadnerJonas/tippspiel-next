import GameFormWrapper from "../../../../components/games/GameFormWrapper";

export default async function EditGameStatePage({params}: { params: { id: number } }) {
    const game_id = Number(params.id);
    const game = await fetch(`http://${process.env.SERVER_ADDRESS}/api/game/?id=${game_id}`).then(response => response.json());

    return (
        <GameFormWrapper game={game}/>
    );
}