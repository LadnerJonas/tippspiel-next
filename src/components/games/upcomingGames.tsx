'use client'
import {useEffect, useMemo, useState} from 'react';
import {
    getKeyValue,
    Pagination,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import {Game} from "../../types/prismaTypes";

export default function Games() {
    const [page, setPage] = useState(1);
    const rowsPerPage = 3;
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/game');
            const data : Game[] = await res.json();
            setGames(data);
        };

        fetchData();
    }, []); // Empty array means this effect runs once when the component mounts

    const columns = [
        {key: 'home_team', label: 'Home Team'},
        {key: 'away_team', label: 'Away Team'},
        {key: 'start_time', label: 'Start Time'},
        {key: 'end_time', label: 'End Time'},
        {key: 'home_score', label: 'Home Score'},
        {key: 'away_score', label: 'Away Score'},
    ];


    const pages = Math.max(1, Math.ceil(games.length / rowsPerPage));

    const items = useMemo(() => {
        const potentialRows = games.map(game => {
            const startTime = new Date(game.start_time);
            const endTime = new Date(game.end_time);
            return {
                ...game,
                start_time: `${startTime.toLocaleDateString('de-DE')} ${startTime.toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit'
                })}`,
                end_time: `${endTime.toLocaleDateString('de-DE')} ${endTime.toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit'
                })}`,
                home_score: game.home_score ?? '-',
                away_score: game.away_score ?? '-',
            };
        });
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return potentialRows.slice(start, end);
    }, [page, games]);

    return (
        <div>
            <p className="text-3xl font-bold">Upcoming games</p>
            <Skeleton isLoaded={games.length > 0}>
                <Table aria-label={"games"}
                       bottomContent={
                           <div className="flex w-full justify-center">
                               <Pagination
                                   isCompact
                                   showControls
                                   showShadow
                                   color="secondary"
                                   page={page}
                                   total={pages}
                                   onChange={(page) => setPage(page)}
                               />
                           </div>}>
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={items}>
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}

                    </TableBody>

                </Table>
            </Skeleton>
        </div>
    );
}