import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const communities = await prisma.community.findMany({where: {name: {contains: req.query.name as string}}});
            res.status(200).json(communities);
        } catch (error) {
            console.error('Error fetching communities:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else if (req.method === 'PUT') {
        const {id, name} = req.body;
        try {
            const updatedCommunity = await prisma.community.update({
                where: {
                    id: id,
                },
                data: {
                    name: name,
                },
            });
            res.status(200).json(updatedCommunity);
        } catch (error) {
            console.error('Error updating community:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else if (req.method === 'DELETE') {
        const {id} = req.body;
        try {
            await prisma.community.delete({
                where: {
                    id: id,
                },
            });
            res.status(204).end();
        } catch (error) {
            console.error('Error deleting community:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else {
        res.status(405).json({message: 'Method Not Allowed'});
    }
}
