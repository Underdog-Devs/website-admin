import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	try {
		const posts = await prisma.blog.findMany({
			orderBy: {
				date: 'desc',
			},
		});
		if (posts) {
			res.status(201).json({ posts });
		}
	} catch (e) {
		res.status(500);
		res.json({ error: 'Internal Server Error Creating User' });
	} finally {
		await prisma.$disconnect();
	}
}
