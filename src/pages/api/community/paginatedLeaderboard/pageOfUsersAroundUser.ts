import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const userId = Number(req.query.userId);
        const communityId = Number(req.query.communityId);
        const page = Number(req.query.page) || 0;
        const pageSize = -Number(req.query.pageSize) -1 || -10;

        try {
            const userPosition = await prisma.$queryRaw`
                SELECT ranked_user_position
                FROM RankedUsersMV
                WHERE user_id = ${userId} AND community_id = ${communityId}
            `;
            if(!userPosition || userPosition.length === 0) return res.status(404).json([]);

            let leaderboard: unknown;
            if (page > 0){
                leaderboard = await prisma.$queryRaw`
                    SELECT ranked_user_position, user_id, rank, username, total_points
                    FROM RankedUsersMV
                    WHERE ranked_user_position >= ${userPosition[0].ranked_user_position + pageSize * page}
                      AND ranked_user_position < ${userPosition[0].ranked_user_position + pageSize * (page - 1) +1}
                      AND community_id = ${communityId}
                    ORDER BY ranked_user_position
                `;}
            else {
                leaderboard = await prisma.$queryRaw`
                    SELECT ranked_user_position, user_id, rank, username, total_points
                    FROM RankedUsersMV
                    WHERE ranked_user_position >= ${userPosition[0].ranked_user_position -1}
                      AND ranked_user_position < ${userPosition[0].ranked_user_position - pageSize}
                      AND community_id = ${communityId}
                    ORDER BY ranked_user_position
                `;
            }
            res.status(200).json(leaderboard);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else {
        res.status(405).json({message: 'Method Not Allowed'});
    }
}