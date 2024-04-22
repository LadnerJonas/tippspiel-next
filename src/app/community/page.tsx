import {Community} from "../../types/prismaTypes";
import {AllCommunities} from "../../components/communities/AllCommunities";
import CreateNewCommunity from "../../components/communities/CreateNewCommunity";
import getUserFromSession from "../../helper/UserSessionHelper";

export default async function () {
    const user = getUserFromSession();
    const communities: Community[] = await fetch(`http://${process.env.SERVER_ADDRESS}/api/community`).then(res => res.json());
    return (
        <>
            <div>
                <div style={{"position": "relative"}}><AllCommunities communities={communities}/></div>
                <br/>
                <div style={{"position": "relative"}}><CreateNewCommunity user={user}/></div>

            </div>

        </>
    )
}

