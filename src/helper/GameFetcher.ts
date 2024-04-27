export async function getAllUpcomingGames() {
    return await fetch(`http://localhost:5173/api/game`).then(res => res.json());
}