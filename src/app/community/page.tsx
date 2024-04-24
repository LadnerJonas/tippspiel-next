import {Community} from "../../types/prismaTypes";
import {SearchCommunities} from "../../components/communities/SearchCommunities";
import CreateNewCommunity from "../../components/communities/CreateNewCommunity";
import getUserFromSession from "../../helper/UserSessionHelper";

export default async function () {
    const user = getUserFromSession();
    let allCommunitiesOfUser: Community[] = [];
    if (user != undefined)
        allCommunitiesOfUser = await fetch(`http://${process.env.SERVER_ADDRESS}/api/user/community?user_id=${user?.id}`).then(res => res.json());
    const allCommunities: Community[] = await fetch(`http://${process.env.SERVER_ADDRESS}/api/community`).then(res => res.json());
    return (
        <>
            <div>
                {allCommunitiesOfUser.length > 0 &&
                    <div style={{"position": "relative"}}><SearchCommunities communities={allCommunitiesOfUser}
                                                                             isAllCommunities={false}/></div>}
                <br/>
                <div style={{"position": "relative"}}><SearchCommunities communities={allCommunities}
                                                                         isAllCommunities={true}/></div>
                <br/>
                {allCommunitiesOfUser.length > 0 &&
                <div style={{"position": "relative"}}><CreateNewCommunity user={user}/></div>}

            </div>

        </>
    )
}

