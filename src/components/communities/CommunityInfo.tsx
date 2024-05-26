'use client'
import React, {useEffect, useState} from 'react';
import ManageUsers from './ManageUsers';
import {Community, User} from "../../types/prismaTypes";
import {Card, CardBody} from "@nextui-org/card";


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
            <p className={"text-3xl"}>{community.id === 0 ? "All Users Community" : community.name }</p>
            {community.id !== 0 &&
                <div style={{display: 'flex', flexWrap: 'wrap', width: "50vw", paddingTop: '5px'}}>
                    {users.map((user) => (
                        <Card key={user.id} style={{marginRight: "3px", marginBottom: "3px"}}>
                            <CardBody>
                                {user.username}
                            </CardBody>
                        </Card>
                    ))}
                </div>
            }
            <br/>
            <ManageUsers communityId={community.id} users={users} setUsers={setUsers}/>
        </div>
    );
}