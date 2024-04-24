import React from 'react';
import CommunityInfo from "../../../components/communities/CommunityInfo";

export default async function CommunityPage({ params }: { params: { id: number } }) {
    const community = await fetch(`http://${process.env.SERVER_ADDRESS}/api/community/user?community_id=${params.id}`).then((res) => res.json());

    return <CommunityInfo  community={community.community} users={community.communitymember} />;
}