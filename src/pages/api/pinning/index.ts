import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const userId = Number(req.query.userId);
        const communityId = Number(req.query.communityId);

        try {
            const pinnedUsers = await prisma.$queryRaw`
                SELECT *
                FROM PinnedUser p, communitymember cm
                WHERE p.user_id = ${userId} AND community_id = ${communityId} AND pinned_user_id = cm.user_id
            `;

            const pinnedUsersWithRank = await Promise.all(pinnedUsers.map(async (pinnedUser) => {
                const userRank = await prisma.$queryRaw`
                    SELECT user_id, username, ranked_user_position, rank, total_points
                    FROM RankedUsersMV
                    WHERE user_id = ${pinnedUser.pinned_user_id} AND community_id = ${communityId}
                `;
                //console.log(pinnedUserWithRank)

                return {
                    pinned_user_id: pinnedUser.pinned_user_id,
                    ranked_user_position: userRank[0].ranked_user_position,
                    rank: userRank[0].rank,
                    username: userRank[0].username,
                    total_points: userRank[0].total_points
                };
            }));

            res.status(200).json(pinnedUsersWithRank);
        } catch (error) {
            console.error('Error fetching pinned users and their ranks:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else if (req.method === 'POST') {
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