import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import {SneakPreviewOfCommunityRow} from "../../../types/prismaTypes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { community_id, user_id } = req.query;

        try {
            const sneakPreview : SneakPreviewOfCommunityRow[] = await prisma.$queryRaw`
                select f_ranked_user_position, f_rank, f_username, f_total_points
                from generate_sneak_preview_leaderboard(p_community_id := CAST(${community_id} AS INT), logged_in_user_id := CAST(${user_id} as INT));
      `;
            res.status(200).json(sneakPreview);
        } catch (error) {
            console.error('Error fetching community leaderboard:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
