import {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const userId = req.query.user_id;

        if (!userId) {
            return res.status(400).json({error: 'User ID is required'});
        }

        try {
            // Get user details along with associated bets
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(userId)
                },
                include: {
                    bet: {include: {game: true}},

                },
            });

            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }

            res.status(200).json(user.bet);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else if (req.method === 'POST') {
        try {
            const newBet = await prisma.bet.create({
                data: {
                    ...req.body
                },
            });
            res.status(201).json(newBet);
        } catch (error) {
            res.status(400).json({error: 'Unable to create bet'});
        }
    }
}