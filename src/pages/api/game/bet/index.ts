import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { user_id, game_id } = req.query;

        if (!user_id || !game_id) {
            return res.status(400).json({ error: 'User ID and Game ID are required' });
        }

        try {
            const bet = await prisma.bet.findFirst({
                where: {
                    user_id: Number(user_id),
                    game_id: Number(game_id),
                },
            });

            if (!bet) {
                return res.status(404).json({ error: 'No bet found for this user and game' });
            }

            res.status(200).json(bet);
        } catch (error) {
            console.error('Error fetching bet:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}