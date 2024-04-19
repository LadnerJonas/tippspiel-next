import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../lib/prisma';
import {setCookie} from "cookies-next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        if (req.query?.hasOwnProperty('username') && typeof req.query.username === 'string') {
            const username = req.query.username as string;
            const user = await prisma.user.findUniqueOrThrow({where: {username: username}});
            res.status(200).json(user);
        } else {
            const users = await prisma.user.findMany();
            res.status(200).json(users);
        }
    } else if (req.method === 'POST') {
        const { username } = req.body;
        try {
            let user = await prisma.user.findUnique({
                where: {
                    username: username,
                },
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        username: username,
                    },
                });
            }

            // Store user information in the session

            setCookie('username', user.username)
            res.status(200).json(user);
        } catch (error) {
            console.error('Error processing login:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({message: 'Method Not Allowed'});
    }
}