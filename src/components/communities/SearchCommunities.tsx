'use client'
import {Community} from "../../types/prismaTypes";
import {Card, CardBody} from "@nextui-org/card";
import Link from "next/link";
import {Input} from "@nextui-org/react";
import {useState} from "react";

export function SearchCommunities({communities, isAllCommunities}: { communities: Community[], isAllCommunities: boolean }) {
    const [communityNameFilter, setCommunityNameFilter] = useState("")

    const elements = 15;
    return (
        <div>
            <h1>Communities</h1>
            <Input type="" value={communityNameFilter}
                   onValueChange={setCommunityNameFilter}
                   label={isAllCommunities ? "Search in all communities" : "Search in your communities"}/>
            <div style={{display: 'flex', flexWrap: 'wrap', width: "50vw"}}>
                {communities.filter(community =>
                    community.name.toLowerCase().indexOf(communityNameFilter.toLowerCase()) !== -1).slice(0, elements)
                    .map((community) => (
                    <Card key={community.id}>
                        <CardBody>
                            <Link href={`/community/${community.id}`}>
                                {community.name}
                            </Link>
                        </CardBody>
                    </Card>))
                }
                {communities.filter(community =>
                    community.name.toLowerCase().indexOf(communityNameFilter.toLowerCase()) !== -1).length > elements &&
                    (<Card key={-1}>
                        <CardBody>
                            ...
                        </CardBody>
                    </Card>)
                }
            </div>

        </div>
    )
}