import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const searchTerm = req.query.searchTerm as string;
        const pageSize = Number(req.query.pageSize) + 1 || 11;
        const page = Number(req.query.page) || 0;
        const communityId = Number(req.query.communityId);
        const searchParameter = `%${searchTerm}%`;

        try {
            const users = await prisma.$queryRaw`
                SELECT ranked_user_position, user_id, rank, username, total_points
                FROM RankedUsersMV
                WHERE username LIKE ${searchParameter} AND community_id = ${communityId}
                ORDER BY ranked_user_position
                LIMIT ${pageSize} OFFSET ${page * pageSize}
            `;
            console.log(users)

            res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else {
        res.status(405).json({message: 'Method Not Allowed'});
    }
}