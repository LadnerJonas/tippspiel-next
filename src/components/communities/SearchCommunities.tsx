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
            <p className="text-xl"> {isAllCommunities ? "All" : "Your"} Communities</p>
            <Input type="" value={communityNameFilter}
                   onValueChange={setCommunityNameFilter}
                   label={isAllCommunities ? "Search in all communities" : "Search in your communities"}/>
            <div style={{display: 'flex', flexWrap: 'wrap', width: "50vw", paddingTop: '5px'}}>
                {communities.sort((x,y) => {
                    if(x.name.length != y.name.length) return x.name.length - y.name.length
                    return x.name.localeCompare(y.name)
                }).filter(community =>
                    community.name.toLowerCase().indexOf(communityNameFilter.toLowerCase()) !== -1).slice(0, elements)
                    .map((community) => (
                    <Card key={community.id} style={{marginRight: "3px", marginBottom: "3px"}}>
                        <CardBody>
                            <Link href={`/community/${community.id}`} className={"text-sm"}>
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