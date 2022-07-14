import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { authorId, entry, title } = req.body;

	try {
		const post = await prisma.blog.create({
			data: {
				title,
				authorId,
				entry,
			},
		});
		if (post) {
			res.status(201).json({ message: 'Post Created', post });
		}
	} catch (e) {
		res.status(500);
		res.json({ error: 'Internal Server Error Creating A Post' });
	} finally {
		await prisma.$disconnect();
	}
}
