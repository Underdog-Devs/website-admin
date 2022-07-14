import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { authorId } = req.body;

	try {
		const posts = await prisma.blog.findMany({
			where: {
				authorId,
			},
		});
		if (posts) {
			res.status(200).json({ posts });
		}
	} catch (e) {
		res.status(500);
		res.json({ error: 'Internal Server Error Requesting Author\'s Posts' });
	} finally {
		await prisma.$disconnect();
	}
}
