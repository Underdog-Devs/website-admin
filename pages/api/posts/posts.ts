import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	try {
		const posts = await prisma.blog.findMany();
		if (posts) {
			res.status(200).json({ posts });
		}
	} catch (e) {
		res.status(500);
		res.json({ error: 'Internal Server Error Requesting Posts' });
	} finally {
		await prisma.$disconnect();
	}
}
