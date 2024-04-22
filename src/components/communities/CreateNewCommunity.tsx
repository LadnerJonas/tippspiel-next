'use client'
import {useState} from "react";
import {Input} from "@nextui-org/react";
import getUserFromSession from "../../helper/UserSessionHelper";

export default function CreateNewCommunity({user}: { user: ReturnType<typeof getUserFromSession>}) {
    const [communityName, setCommunityName] = useState("")

    async function createCommunity(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        fetch('/api/community/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({communityName, username: user?.username}),
        })
        setCommunityName("")
    }

    return (
        <div>
            <h1>Create New Community</h1>
            <p>Here you can create a new community!</p>
            <form onSubmit={createCommunity}>
                <Input value={communityName} onValueChange={setCommunityName}/>
                <Input type="submit" disabled={communityName.length <3} value="Create Community"/>
            </form>
        </div>
    )
}