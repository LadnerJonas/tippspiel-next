import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const page = Number(req.query.page) || 0;
        const pageSize = Number(req.query.pageSize) || 10;
        const skip = (page) * pageSize;
        const communityId = Number(req.query.communityId);

        try {
            const leaderboard = await prisma.$queryRaw`
                SELECT ranked_user_position, user_id, rank, username, total_points
                FROM RankedUsersMV
                WHERE community_id = ${communityId}
                ORDER BY ranked_user_position
                LIMIT ${pageSize + 1} OFFSET ${skip}
            `;
            res.status(200).json(leaderboard);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else {
        res.status(405).json({message: 'Method Not Allowed'});
    }
}