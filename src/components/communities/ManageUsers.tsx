import React, {useEffect, useState} from 'react';
import {Button} from "@nextui-org/react";
import {User} from "../../types/prismaTypes";


type ManageUsersProps = {
    communityId: number;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export default function ManageUsers({ communityId, users, setUsers }: ManageUsersProps) {
    const [userNameToAdd, setUserNameToAdd] = useState('');
    const [userNameToRemove, setUserNameToRemove] = useState('');

    useEffect(() => {
        setUsers(users);
    }, [users]);

    const handleAddUser = async () => {
        try {
            const response = await fetch(`/api/community/user?community_id=${communityId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: userNameToAdd }),
            });
            const response2 = await response.json();
            setUsers( [...users, {id: response2.user_id, username: userNameToAdd, created_at: new Date()}])
            setUserNameToAdd('');
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleRemoveUser = async () => {
        try {
            const response = await fetch(`/api/community/user?community_id=${communityId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: userNameToRemove }),
            });
            if(response.status !== 204) {
                setUserNameToRemove("invalid username")
                return;
            }
            setUsers((prevUsers) => prevUsers.filter((user) => user.username !== userNameToRemove));
            setUserNameToRemove('');
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };

    return (
        <div>
            <h2>Manage Users</h2>
            <div>
                <input
                    type="text"
                    value={userNameToAdd}
                    onChange={(e) => setUserNameToAdd(e.target.value)}
                    placeholder="Username to add"
                />
                <Button onClick={handleAddUser}>Add User</Button>
            </div>
            <div>
                <input
                    type="text"
                    value={userNameToRemove}
                    onChange={(e) => setUserNameToRemove(e.target.value)}
                    placeholder="Username to remove"
                />
                <Button onClick={handleRemoveUser}>Remove User</Button>
            </div>
        </div>
    );
}