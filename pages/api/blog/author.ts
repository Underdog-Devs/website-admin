import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { authorId } = req.body;

	try {
		const post = await prisma.blog.findMany({
			where: {
				authorId,
			},
		});
		if (post) {
			res.status(201).json({ post });
		}
	} catch (e) {
		res.status(500);
		res.json({ error: 'Internal Server Error Requesting Authors Posts' });
	} finally {
		await prisma.$disconnect();
	}
}
