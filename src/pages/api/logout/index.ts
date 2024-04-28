import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        res.setHeader('Set-Cookie', "session=; path=/;")
        res.status(200).json({message: 'Logged out'});
    } else {
        res.status(405).json({message: 'Method Not Allowed'});
    }
}