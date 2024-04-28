import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const bet_id = req.query.bet_id as string;

        try {
            const bet = await prisma.bet.findUnique({
                where: {
                    id: parseInt(bet_id),
                },
            });

            if (!bet) {
                return res.status(404).json({error: 'Bet not found'});
            }

            res.status(200).json(bet);
        } catch (error) {
            console.error('Error fetching bet:', error);
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
    } else if (req.method === 'PUT') {
        const {id} = req.body;
        try {
            if (id) {
                const updatedBet = await prisma.bet.update({
                    where: {
                        id: id,
                    },
                    data: {
                        ...req.body
                    },
                });
                res.status(200).json(updatedBet);
            } else {
                const newBet = await prisma.bet.create({
                    data: {
                        ...req.body
                    },
                });
                res.status(201).json(newBet);
            }
        } catch (error) {
            console.error('Error updating or creating bet:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else if (req.method === 'DELETE') {
        try {
            await prisma.bet.delete({
                where: {
                    id: req.body.id,
                },
            });
            res.status(204).end();
        } catch (error) {
            console.error('Error deleting bets:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else {
        res.status(405).json({message: 'Method Not Allowed'});
    }
}
