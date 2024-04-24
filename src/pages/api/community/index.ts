import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const communities = await prisma.community.findMany();
            res.status(200).json(communities);
        } catch (error) {
            console.error('Error fetching communities:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else if (req.method === 'POST') {
        const { communityName , username} = req.body;

        try {
            const user = await prisma.user.findUnique({
                where: {
                    username: username,
                },
                include: {
                    communitymember: true,
                },
            });

            if (!user) {
                res.status(404).json({error: 'User not found'});
                return;
            }

            if (user.communitymember.length >= 6) {
                res.status(400).json({error: 'User is already part of 6 communities'});
                return;
            }

            const newCommunity = await prisma.community.create({
                data: {
                    name: communityName,
                    communitymember: {
                        create: {
                            user_id: user.id,
                        },
                    },
                },
            });

            res.status(201).json(newCommunity);
        } catch (error) {
            console.error('Error creating community:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }else if (req.method === 'DELETE') {
        const {id} = req.body;
        try {
            await prisma.community.delete({
                where: {
                    id: id,
                },
            });
            res.status(204).end();
        } catch (error) {
            console.error('Error deleting community:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else {
        res.status(405).json({message: 'Method Not Allowed'});
    }
}
