import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import {Game} from "../../../types/prismaTypes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const id = req.query.id;

        if (!id) {
            const games : Game[] = await prisma.game.findMany({
                orderBy: {
                    start_time: 'asc',
                }
            });
            res.status(200).json(games);
            return;
        }

        const gameId = parseInt(id as string);
        try {
            const game: Game | null = await prisma.game.findUnique({
                where: {
                    id: gameId,
                },
            });
            if (!game) {
                return res.status(404).json({ error: 'Game not found' });
            }
            res.status(200).json(game);
        } catch (error) {
            console.error('Error fetching game:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {
        const gameId = req.body.id;
        try {
            const updatedGame = await prisma.game.update({
                where: {
                    id: gameId,
                },
                data: {
                    ...req.body
                },
            });
            res.status(200).json(updatedGame);
        } catch (error) {
            console.error('Error updating game:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'DELETE') {
        const gameId = req.body.id;
        try {
            await prisma.game.delete({
                where: {
                    id: gameId,
                },
            });
            res.status(204).end();
        } catch (error) {
            console.error('Error deleting game:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
