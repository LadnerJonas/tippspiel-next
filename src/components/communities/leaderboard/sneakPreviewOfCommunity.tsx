import React, {useCallback, useEffect, useState} from "react";
import {SneakPreviewOfCommunityRow, User} from "../../../types/prismaTypes";
import {
    getKeyValue, semanticColors,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import {useWebSocket} from "next-ws/client";

type SneakPreviewOfCommunityProps = {
    community_id: number;
    user: User
}

export default function SneakPreviewOfCommunity({user,community_id}: SneakPreviewOfCommunityProps) {
    if (!user) {
        return <p>You must be logged in to see the leaderboard.</p>;
    }
    const ws = useWebSocket();

    const [sneakPreview, setSneakPreview] = useState<SneakPreviewOfCommunityRow[]>([]);
    const fetchData = async () => {
        const res = await fetch('http://localhost:5173/api/community/sneakPreviewOfLeaderBoard?community_id=' + community_id + '&user_id=' + user.id);
        const data : SneakPreviewOfCommunityRow[] = await res.json();
        setSneakPreview(data);
    };
    useEffect(() => {
        fetchData();
    }, []);

    const onMessage = useCallback(
        async () => {
            await fetchData();
        },
        [],
    );

    ws?.addEventListener('message', onMessage);


    const columns = [
        {key: 'f_rank', label: 'Rank'},
        {key: 'f_username', label: 'Username'},
        {key: 'f_total_points', label: 'Total Points'},
    ];

    return (
        <div>
            <Skeleton isLoaded={sneakPreview.length > 0}>
            <Table aria-label={"sneakPreviewOfCommunity"}>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={sneakPreview}>
                    {(item) => (
                        <TableRow key={item.f_ranked_user_position} style={item.f_username === user.username ? { backgroundColor: semanticColors.dark.default[100] } : {}}
                        >
                            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}

                </TableBody>
            </Table>
            </Skeleton>
        </div>
    );
}