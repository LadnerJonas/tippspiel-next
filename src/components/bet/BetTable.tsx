'use client'
import {Button, getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import Link from "next/link";

export default function BetTable({x}) {
    const alreadyStarted = new Date(x.game.start_time) < new Date();

    const columns = [
        {key: 'home_team_goals', label: 'Home Team'},
        {key: 'away_team_goals', label: 'Away Team'},
        {key: 'points_earned', label: alreadyStarted ? 'Points earned' : "Edit Bet"}
    ];
    return (
        <div key={x.id}>
            <Table aria-label={"test"}>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={[x]}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) =>
                                <TableCell key={columnKey}>
                                    {columnKey === 'points_earned' ? (
                                            alreadyStarted ?
                                                (x.points_earned) : (<div className="flex justify-center">
                                                    <Button>
                                                        <Link href={`/bet/${x.id}`}>Edit Bet</Link>
                                                    </Button>
                                                </div>)
                                        )
                                        : getKeyValue(item, columnKey)}
                                </TableCell>}

                        </TableRow>
                    )}
                </TableBody>
            </Table>

        </div>
    )
}