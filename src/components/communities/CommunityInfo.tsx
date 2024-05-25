'use client'
import React, {useEffect, useState} from 'react';
import ManageUsers from './ManageUsers';
import {Community, User} from "../../types/prismaTypes";


type CommunityInfoProps = {
    community: Community;
    users: User[];
};

export default function CommunityInfo({ community , users: initialUsers }: CommunityInfoProps) {
    const [users, setUsers] = useState(initialUsers);

    useEffect(() => {
        setUsers(users);
    }, [users]);

    return (
        <div>
            <h1>{community.name}</h1>
            {community.id !== 0 &&
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>{user.username}</li>
                    ))}
                </ul>
            }
            <ManageUsers communityId={community.id} users={users} setUsers={setUsers}/>
        </div>
    );
}