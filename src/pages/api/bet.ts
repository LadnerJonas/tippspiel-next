import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const username = req.query.username as string;

        if (!username) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            // Get user details along with associated bets
            const user = await prisma.user.findUnique({
                where: {
                    username: username,
                },
                include: {
                    bet: true, // Include associated bets
                },
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json(user.bet);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
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
            res.status(400).json({ error: 'Unable to create bet' });
        }
    } else if (req.method === 'PUT') {
        const {id} = req.body;
        try {
            const updatedBet = await prisma.bet.update({
                where: {
                    id: id,
                },
                data: {
                    ...req.body
                },
            });
            res.status(200).json(updatedBet);
        } catch (error) {
            console.error('Error updating bet:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }else if (req.method === 'DELETE') {
        try {
            await prisma.bet.delete({
                where: {
                    id: req.body.id,
                },
            });
            res.status(204).end();
        } catch (error) {
            console.error('Error deleting bets:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
