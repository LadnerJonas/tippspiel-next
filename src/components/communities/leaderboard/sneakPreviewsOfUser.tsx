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
            {communities.length > 0 && communities.map((community) => {
                return <div key={community.id}>
                    <h2>{community.name}</h2>
                    <SneakPreviewOfCommunity user={user} community_id={community.id}/>
                </div>
            })}

        </WebSocketProvider>
    </div>)
}