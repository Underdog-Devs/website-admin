import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.body;

	try {
		const post = await prisma.blog.findUnique({
			where: {
				id,
			},
		});
		if (post) {
			res.status(201).json({ post });
		}
	} catch (e) {
		res.status(500);
		res.json({ error: 'Internal Server Error Requesting A Post' });
	} finally {
		await prisma.$disconnect();
	}
}
