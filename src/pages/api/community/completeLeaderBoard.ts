import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import {CacheInvalidateTime, getCache, setCache} from "../../../helper/apiCacheHelper";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const response = getCache(req.url)
        if (response) {
            res.status(200).json(response);
            return;
        }
        try {
            const communityId = String(req.query.communityId);
            const leaderboard = await prisma.$queryRaw`
        SELECT
          cast("username" as text),
          cast("total_points" as integer),
          cast("rank" as integer)
        FROM
          communityLeaderboard_AllUsers
        limit 100
      `;
            setCache(req.url, leaderboard, CacheInvalidateTime.HOT.valueOf())
            res.status(200).json(leaderboard);
        } catch (error) {
            console.error('Error fetching community leaderboard:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
