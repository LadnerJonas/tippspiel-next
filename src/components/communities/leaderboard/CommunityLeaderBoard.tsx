'use client'
import {useEffect, useState} from 'react';
import {FullLeaderboardRow, User} from "../../../types/prismaTypes";
import {
    Button,
    getKeyValue,
    Input,
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
    user: User | undefined,
    communityId: number,
    initialPinnedUsers: FullLeaderboardRow[]
}) {
    const [pinnedUsers, setPinnedUsers] = useState<FullLeaderboardRow[]>(props.initialPinnedUsers);

    const [topUsers, setTopUsers] = useState<FullLeaderboardRow[]>(props?.initialLeaderBoardTopUsers?.slice(0, 10));
    const [usersAroundUser, setUsersAroundUser] = useState<FullLeaderboardRow[]>(props.initialLeaderBoardAroundUser.slice(1, 11));
    const [merged, setMerged] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [lastSearchTerm, setLastSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<FullLeaderboardRow[]>([]);
    const [hasMoreResults, setHasMoreResults] = useState(false);

    const columns =  props.user ? [
        {label: "Ranked User Position", key: "ranked_user_position"},
        {label: "Rank", key: "rank"},
        {label: "Username", key: "username"},
        {label: "Total Points", key: "total_points"},
         {label: "Pin", key: "pin"}
    ] : [
            {label: "Ranked User Position", key: "ranked_user_position"},
            {label: "Rank", key: "rank"},
            {label: "Username", key: "username"},
            {label: "Total Points", key: "total_points"},
        ]
    ;

    const fetchSearchResults = async () => {
        const response = await fetch(`http://localhost:5173/api/community/paginatedLeaderboard/searchAfterUser?communityId=${props.communityId}&searchTerm=${searchTerm}&page=${searchResults.length/5}`);
        const newSearchResults = await response.json();

        setHasMoreResults(newSearchResults.length > 5);
        if(searchTerm !== lastSearchTerm){
            setSearchResults([...newSearchResults.slice(0, 5)]);

        }else{
            setSearchResults([...searchResults, ...newSearchResults.slice(0, 5)]);
        }
        setLastSearchTerm(searchTerm)
      };

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

    const addPinnedUser = async (userId: number) => {
        if(props.user?.id === undefined) return;
        const response = await fetch(`http://localhost:5173/api/pinning`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: props.user?.id,
                pinnedUserId: userId
            }),
        });
        const newPinnedUser = await response.json();
        pinnedUsers.push(newPinnedUser);
        window.location.reload()
    };

    const removePinnedUser = async (userId: number) => {
        if(props.user?.id === undefined) return;
        await fetch(`http://localhost:5173/api/pinning`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: props.user?.id,
                pinnedUserId: userId
            }),
        });
        setPinnedUsers(pinnedUsers.filter(user => user.pinned_user_id !== userId));
        window.location.reload()
    };

    const isPinned = (userId: number) => {
        return pinnedUsers.some(user => user.pinned_user_id === userId) || userId === props.user?.id
    };


    useEffect(() => {
        if (usersAroundUser.length > 0 && !merged && topUsers[topUsers.length - 1].ranked_user_position >= usersAroundUser[0].ranked_user_position) {
            setMerged(true);
            let temp = usersAroundUser.filter((user) => user.ranked_user_position > topUsers[topUsers.length - 1].ranked_user_position);
            setTopUsers([...topUsers, ...temp]);
        }
    }, [usersAroundUser]);

    return (
        <div>
            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search users..." />
            <Button onClick={fetchSearchResults}>Search</Button>

            {searchResults.length > 0 && (
                <Table aria-label={"CommunityLeaderboardSearchResults"}>
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column!.key}>{column!.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={searchResults}>
                        {(item) => (
                            <TableRow key={item.ranked_user_position}>
                                {(columnKey) => columnKey == "pin" ? <TableCell>
                                    <Button disabled={isPinned(item.user_id)} onClick={() => addPinnedUser(item.user_id)} >Pin</Button>
                                </TableCell> : <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}

            {hasMoreResults && <Button onClick={fetchSearchResults}>Load more</Button>}
            <br/>

            {pinnedUsers.length > 0 && (
                <>
                    <text> Pinned Users:</text>
                    <Table aria-label={"CommunityLeaderboardPinnedUsers"}>
                        <TableHeader columns={columns}>
                            {(column) => <TableColumn key={column!.key}>{column!.label}</TableColumn>}
                        </TableHeader>
                        <TableBody items={pinnedUsers}>
                            {(item) => {
                                return (
                                <TableRow key={item.ranked_user_position}
                                          style={item.username === props.user?.username ? {backgroundColor: semanticColors.dark.default[100]} : {}}>
                                    {(columnKey) => columnKey == "pin" ? <TableCell>
                                        <Button onPress={() => removePinnedUser(item.pinned_user_id)}>Unpin</Button>
                                    </TableCell> : <TableCell>{getKeyValue(item, columnKey)}</TableCell>}

                                </TableRow>)
                                }}
                        </TableBody>
                    </Table>
                    <br/>
                </>
            )}
            <text>Community Leaderboard: </text>
            <Table aria-label={"CommunityLeaderboard"}
                   bottomContent={(topUsers.length % 10 == 0 || merged && topUsers.length % 10 == 9) &&
                       <Button onClick={fetchNextTopUsers}>⮟</Button>}>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column!.key}>{column!.label}</TableColumn>}
                </TableHeader>
                <TableBody items={topUsers}>
                    {(item) => (
                        <TableRow key={item.ranked_user_position}
                                  style={item.username === props.user?.username ? {backgroundColor: semanticColors.dark.default[100]} : {}}>
                            {(columnKey) => columnKey == "pin" ? <TableCell>
                                <Button disabled={isPinned(item.user_id)} onClick={() => addPinnedUser(item.user_id)} >Pin</Button>
                            </TableCell> : <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {!merged && usersAroundUser.length > 0 && (
                <Table aria-label={"CommunityLeaderboard2"}
                       topContent={<Button onClick={fetchNextUsersAroundUser}>⮝</Button>}>
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column!.key}>{column!.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={usersAroundUser}>
                        {(item) => (
                            <TableRow key={item.ranked_user_position}
                                      style={item.username === props.user?.username ? {backgroundColor: semanticColors.dark.default[100]} : {}}>
                                {(columnKey) => columnKey == "pin" ? <TableCell>
                                    <Button disabled={isPinned(item.user_id)} onClick={() => addPinnedUser(item.user_id)} >Pin</Button>
                                </TableCell> : <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}