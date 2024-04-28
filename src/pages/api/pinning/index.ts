import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {userId, pinnedUserId} = req.body;
        try {
            const newPinnedUser = await prisma.pinneduser.create({
                data: {
                    user_id: userId,
                    pinned_user_id: pinnedUserId
                },
            });
            res.status(201).json(newPinnedUser);
        } catch (error) {
            console.error('Error creating pinned user:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else if (req.method === 'DELETE') {
        const {userId, pinnedUserId} = req.body;
        try {
            await prisma.pinneduser.delete({
                where: {
                    user_id_pinned_user_id: {
                        user_id: userId,
                        pinned_user_id: pinnedUserId
                    }
                },
            });
            res.status(204).end();
        } catch (error) {
            console.error('Error deleting pinned user:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else {
        res.status(405).json({message: 'Method Not Allowed'});
    }
}