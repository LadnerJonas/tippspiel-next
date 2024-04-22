'use client'
import {Community} from "../../types/prismaTypes";
import {Card, CardBody} from "@nextui-org/card";
import Link from "next/link";
import {Input} from "@nextui-org/react";
import {useState} from "react";

export function AllCommunities({communities}: { communities: Community[] }) {

    const [communityNameFilter, setCommunityNameFilter] = useState("")


    const elements = 15;
    return (
        <div>
            <h1>Communities</h1>
            <Input type="" value={communityNameFilter}
                   onValueChange={setCommunityNameFilter} label="Search for your Community"/>
            <div style={{display: 'flex', flexWrap: 'wrap', width: "50vw"}}>
                {communities.filter(community =>
                    community.name.toLowerCase().indexOf(communityNameFilter.toLowerCase()) !== -1).slice(0, elements)
                    .map((community) => (
                    <Card>
                        <CardBody>
                            <Link key={community.id} href={`/community/${community.id}`}>
                                {community.name}
                            </Link>
                        </CardBody>
                    </Card>))
                }
                {communities.filter(community =>
                    community.name.toLowerCase().indexOf(communityNameFilter.toLowerCase()) !== -1).length > elements &&
                    (<Card>
                        <CardBody>
                            ...
                        </CardBody>
                    </Card>)
                }
            </div>

        </div>
    )
}