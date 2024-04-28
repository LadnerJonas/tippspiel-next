'use client'
import {useEffect, useState} from 'react';
import {FullLeaderboardRow} from "../../../types/prismaTypes";
import {
    Button,
    getKeyValue,
    semanticColors,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";

export default function CommunityLeaderBoard(props: {
    initialLeaderBoardAroundUser: FullLeaderboardRow[],
    initialLeaderBoardTopUsers: FullLeaderboardRow[],
    user: { username: string },
    communityId: number
}) {
    const [topUsers, setTopUsers] = useState<FullLeaderboardRow[]>(props.initialLeaderBoardTopUsers.slice(0, 10));
    const [usersAroundUser, setUsersAroundUser] = useState<FullLeaderboardRow[]>(props.initialLeaderBoardAroundUser.slice(1, 11));
    const [merged, setMerged] = useState(false);

    const columns = [
        {label: "Ranked User Position", key: "ranked_user_position"},
        {label: "Rank", key: "rank"},
        {label: "Username", key: "username"},
        {label: "Total Points", key: "total_points"}
    ];

    const fetchNextTopUsers = async () => {
        const response = await fetch(`http://localhost:5173/api/community/paginatedLeaderboard/pageOfTopUsers?communityId=${props.communityId}&page=${topUsers.length/10}`);
        const newTopUsers = await response.json();

        setTopUsers([...topUsers, ...newTopUsers.slice(0,10)]);
    };

    const fetchNextUsersAroundUser = async () => {
        const response = await fetch(`http://localhost:5173/api/community/paginatedLeaderboard/pageOfUsersAroundUser?communityId=${props.communityId}&userId=${props.initialLeaderBoardAroundUser[0].user_id}&page=${usersAroundUser.length/10}`);
        const newUsersAroundUser = (await response.json()).filter((user : FullLeaderboardRow) => user.ranked_user_position < usersAroundUser[0].ranked_user_position)
        setUsersAroundUser([...newUsersAroundUser.slice(1), ...usersAroundUser]);
    };

    useEffect(() => {
        if (!merged && topUsers[topUsers.length - 1].ranked_user_position >= usersAroundUser[0].ranked_user_position) {
            setMerged(true);
            let temp = usersAroundUser.filter((user) => user.ranked_user_position > topUsers[topUsers.length - 1].ranked_user_position);
            setTopUsers([...topUsers, ...temp]);
        }
    }, [topUsers, usersAroundUser]);

    return (
        <div>
            <Table aria-label={"CommunityLeaderboard"}
                   bottomContent={<Button onClick={fetchNextTopUsers}>⮟</Button>}>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={topUsers}>
                    {(item) => (
                        <TableRow key={item.ranked_user_position}
                                  style={item.username === props.user.username ? {backgroundColor: semanticColors.dark.default[100]} : {}}>
                            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>


            {!merged && (
                <Table aria-label={"CommunityLeaderboard2"}
                       topContent={<Button onClick={fetchNextUsersAroundUser}>⮝</Button>}>
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={usersAroundUser}>
                        {(item) => (
                            <TableRow key={item.ranked_user_position}
                                      style={item.username === props.user.username ? {backgroundColor: semanticColors.dark.default[100]} : {}}>
                                {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}