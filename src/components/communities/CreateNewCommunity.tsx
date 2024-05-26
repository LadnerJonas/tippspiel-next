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
            <p className="text-xl">Create New Community</p>
            <p>Here you can create a new community!</p>
            <form onSubmit={createCommunity}>
                <div className={"flex w-full flex-wrap md:flex-wrap gap-1.5"} >
                    <Input className={"w-full"} value={communityName} onValueChange={setCommunityName}/>
                    <Input type="submit" disabled={communityName.length < 3}
                           value="Create Community" style={{color: "primary"}}/>
                </div>
            </form>
        </div>
    )
}