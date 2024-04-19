import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const leaderboard = await prisma.$queryRaw`
        SELECT
          "community_id",
          "user_id",
          "username",
          cast("total_score" as integer),
          cast("rank" as integer)
        FROM
          communityLeaderboard_AllUsers
        WHERE community_id = ${req.query.communityId}
      `;
            res.status(200).json(leaderboard);
        } catch (error) {
            console.error('Error fetching community leaderboard:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
