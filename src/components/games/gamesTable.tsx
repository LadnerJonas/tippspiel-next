'use client'
import {useMemo, useState} from "react";
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
import Link from "next/link";
import {Game} from "../../types/prismaTypes";
import {toZonedTime} from "date-fns-tz";

export default function GamesTable({games, href}:{ games: Game[],  href : string}) {
    const [page, setPage] = useState(1);

    const columns = [
        {key: 'home_team', label: 'Home Team'},
        {key: 'away_team', label: 'Away Team'},
        {key: 'start_time', label: 'Start Time'},
        {key: 'end_time', label: 'End Time'},
        {key: 'home_score', label: 'Home Score'},
        {key: 'away_score', label: 'Away Score'},
    ];

    const rowsPerPage = 3;
    const pages = Math.max(1, Math.ceil(games.length / rowsPerPage));

    const items = useMemo(() => {
        const potentialRows = games.map(game => {
            const utc = 'UTC';

            const startTime = new Date(game.start_time);
            const endTime = new Date(game.end_time);

            const zonedStartTime = toZonedTime(startTime, utc);
            const zonedEndTime = toZonedTime(endTime, utc);

            return {
                ...game,
                start_time: `${zonedStartTime.toLocaleDateString('de-DE')} ${zonedStartTime.toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit'
                })}`,
                end_time: `${zonedEndTime.toLocaleDateString('de-DE')} ${zonedEndTime.toLocaleTimeString('de-DE', {
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
            <Skeleton isLoaded={games.length > 0}>
                <Table aria-label={"games"}
                       bottomContent={
                           games.length > rowsPerPage && <div className="flex w-full justify-center">
                               <Pagination
                                   isCompact
                                   showControls
                                   showShadow
                                   color="primary"
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
                                {(columnKey) => <TableCell><Link
                                    href={`${href}${item.id}`}>{getKeyValue(item, columnKey)}</Link></TableCell>}
                            </TableRow>
                        )}

                    </TableBody>

                </Table>
            </Skeleton>
        </div>
    );
}