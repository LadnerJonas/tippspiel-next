import React from 'react';
import CommunityInfo from "../../../components/communities/CommunityInfo";

export default async function CommunityPage({params}: { params: { id: number } }) {
    const response = await fetch(`http://${process.env.SERVER_ADDRESS}/api/community/user?community_id=${params.id}`, {cache: "no-cache"}).then((res) => res.json());
    const {community, communitymember} = response;
    return <CommunityInfo community={community} users={communitymember}/>;
}