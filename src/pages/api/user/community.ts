import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        if (req.query?.hasOwnProperty('user_id') && typeof req.query.user_id === 'string') {
            const user_id = parseInt(req.query.user_id as string);
            try {
                const userCommunities = await prisma.user.findUnique({
                    where: {id: user_id},
                    include: {communitymember: {include: {community: true}}}
                });
                if (!userCommunities) {
                    res.status(404).json({message: 'User not found'});
                    return;
                }
                const communities = userCommunities.communitymember.map(member => member.community);
                res.status(200).json(communities);
            } catch (error) {
                console.error('Error fetching user communities:', error);
                res.status(500).json({error: 'Internal Server Error'});
            }
        } else {
            res.status(400).json({message: 'Bad Request: user_id is required'});
        }
    } else {
        res.status(405).json({message: 'Method Not Allowed'});
    }
}