import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../lib/prisma';
import {serialize} from 'cookie';
import {User} from "../../../types/prismaTypes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        if (req.query?.hasOwnProperty('username') && typeof req.query.username === 'string') {
            const username = req.query.username as string;
            const user : User = await prisma.user.findUniqueOrThrow({where: {username: username}});
            res.status(200).json(user);
        } else {
            const users : User[] = await prisma.user.findMany();
            res.status(200).json(users);
        }
    } else if (req.method === 'POST') {
        const { username } = req.body;
        try {
            let user : User | null = await prisma.user.findUnique({
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
                prisma.communitymember.create({
                    data: {
                        user_id: user.id,
                        community_id: 0
                    }

                })
            }

            const cookie = serialize('session', JSON.stringify(user), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // One week
                path: '/',
            })
            res.setHeader('Set-Cookie', cookie)
            res.status(200).json(user);
        } catch (error) {
            console.error('Error processing login:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({message: 'Method Not Allowed'});
    }
}