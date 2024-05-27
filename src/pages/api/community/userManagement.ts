import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { communityId, userId } = req.body;
        try {
            const community = await prisma.community.findUnique({
                where: {
                    id: communityId,
                },
            });
            if (!community) {
                return res.status(404).json({ error: 'Community not found' });
            }
            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const existingMembership = await prisma.communitymember.findFirst({
                where: {
                    community_id: communityId,
                    user_id: userId,
                },
            });
            if (existingMembership) {
                return res.status(400).json({ error: 'User is already a member of the community' });
            }
            const newMembership = await prisma.communitymember.create({
                data: {
                    community_id: communityId,
                    user_id: userId,
                },
            });
            res.status(201).json(newMembership);
        } catch (error) {
            console.error('Error adding user to community:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'DELETE') {
        const { communityId, userId } = req.body;
        try {
            const community = await prisma.community.findUnique({
                where: {
                    id: communityId,
                },
            });
            if (!community) {
                return res.status(404).json({ error: 'Community not found' });
            }
            const user = await prisma.user.findUnique({
                where: {
                    username: userId,
                },
            });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const existingMembership = await prisma.communitymember.findFirst({
                where: {
                    community_id: communityId,
                    user_id: user.id,
                },
            });
            if (!existingMembership) {
                return res.status(400).json({ error: 'User is not a member of the community' });
            }
            await prisma.communitymember.delete({
                where: {
                    community_id_user_id: {
                        community_id: communityId, user_id: user.id
                    },
                },
            });
            res.status(204).end();
        } catch (error) {
            console.error('Error removing user from community:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
