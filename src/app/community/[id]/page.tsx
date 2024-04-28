import React from 'react';
import CommunityInfo from "../../../components/communities/CommunityInfo";
import getUserFromSession from "../../../helper/UserSessionHelper";
import {FullLeaderboardRow} from "../../../types/prismaTypes";
import CommunityLeaderBoard from "../../../components/communities/leaderboard/CommunityLeaderBoard";


export default async function CommunityPage({params}: { params: { id: number } }) {
    let communityMemberResponse: any;
    let community: any, communitymember: any;
    if (params.id !== 0) {
        communityMemberResponse = await fetch(`http://${process.env.SERVER_ADDRESS}/api/community/user?community_id=${params.id}`, {cache: "no-cache"}).then((res) => res.json());
        ({community, communitymember} = communityMemberResponse);
    }

    const initialLeaderBoardTopUsers : FullLeaderboardRow[] = await fetch(`http://${process.env.SERVER_ADDRESS}/api/community/paginatedLeaderboard/pageOfTopUsers?communityId=${params.id}`, {cache: "no-cache"}).then((res) => res.json());
    const user = getUserFromSession();
    let initialLeaderBoardAroundUser : FullLeaderboardRow[] = [];
    if(user){
        initialLeaderBoardAroundUser = await fetch(`http://${process.env.SERVER_ADDRESS}/api/community/paginatedLeaderboard/pageOfUsersAroundUser?communityId=${params.id}&userId=${user.id}`, {cache: "no-cache"}).then((res) => res.json());
    }

    return (<div>
        <CommunityInfo community={community} users={communitymember}/>
        <CommunityLeaderBoard initialLeaderBoardTopUsers={initialLeaderBoardTopUsers} initialLeaderBoardAroundUser={initialLeaderBoardAroundUser} user={user} communityId={params.id}/>
    </div>);
}