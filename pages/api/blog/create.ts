import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { authorId, entry } = req.body;

	try {
		const post = await prisma.blog.create({
			data: {
				authorId,
				entry,
			},
		});
		if (post) {
			res.status(201).json({ message: 'Post Created' });
		}
	} catch (e) {
		res.status(500);
		res.json({ error: 'Internal Server Error Creating A Post' });
	} finally {
		await prisma.$disconnect();
	}
}
