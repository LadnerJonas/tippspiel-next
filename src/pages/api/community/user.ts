import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
    const { community_id } = req.query;

    if (req.method === 'GET') {
        // Get all communityInfoAndUsers of a community
        const communityInfoAndUsers = await prisma.community.findUnique({
            where: { id: Number(community_id) },
            include: { communitymember: { include: { User: true } } },
        });

        if (!communityInfoAndUsers) {
            res.status(404).json({ error: 'Community not found' });
            return;
        }

        res.status(200).json({ "community": {name: communityInfoAndUsers.name, id: communityInfoAndUsers.id}, "communitymember": communityInfoAndUsers.communitymember.map(cm => cm.User) });
        return;
    }
    else if (req.method === 'POST') {
        // Prevent changes if community_id is 0
        if (community_id == 0) {
            res.status(400).json({ error: 'Cannot modify users of community with id 0' });
            return;
        }

        // Add a user to a community
        const { username } = req.body;

        // Fetch the user from the database
        const user = await prisma.user.findUnique({
            where: {
                username: username,
            },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const newUser = await prisma.communitymember.create({
            data: {
                community_id: Number(community_id),
                user_id: user.id,
            },
        });

        res.status(201).json(newUser);
    }
    else if (req.method === 'DELETE') {
        // Prevent changes if community_id is 0
        if (community_id == 0) {
            res.status(400).json({ error: 'Cannot modify users of community with id 0' });
            return;
        }
        // Remove a user from a community
        const { username } = req.body;

        // Fetch the user from the database
        const user = await prisma.user.findUnique({
            where: {
                username: username,
            },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const deletedUser = await prisma.communitymember.deleteMany({
            where: {
                community_id: Number(community_id),
                user_id: user.id,
            },
        });

        res.status(200).json(deletedUser);
    }
    else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}