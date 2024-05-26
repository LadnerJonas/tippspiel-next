'use client'
import {useEffect, useState} from "react";
import {Community, User} from "../../../types/prismaTypes";
import SneakPreviewOfCommunity from "./sneakPreviewOfCommunity";
import {WebSocketProvider} from "next-ws/client";

export default function SneakPreviewOfUser(props: { user: User }) {
    const user = props.user;
    if (!user) {
        return <p>You must be logged in to see the leaderboard.</p>;
    }
    const [communities, setCommunities] = useState<Community[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/user/community?user_id=' + user.id);
            const data: Community[] = await res.json();
            setCommunities(data);
        };

        fetchData();
    }, []);

    return (<div>
        <WebSocketProvider url={`ws://localhost:5173/ws`}>
            <p className="text-3xl">Sneakpreviews</p>
            <p>See your current rank in each of your communities.</p>
            {communities.length > 0 && communities.map((community) => {
                return <div key={community.id}>
                    <p className="text-xl">{community.name}</p>
                    <SneakPreviewOfCommunity user={user} community_id={community.id}/>
                    <br/>
                </div>
            })}

        </WebSocketProvider>
    </div>)
}