import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { id, entry } = req.body;

	try {
		const post = await prisma.blog.update({
			where: {
				id,
			},
			data: {
				entry,
			},
		});
		if (post) {
			res.status(201).json({ message: 'Post Was Edited Successfully' });
		}
	} catch (e) {
		res.status(500);
		res.json({ error: 'Internal Server Error Editing A Post' });
	} finally {
		await prisma.$disconnect();
	}
}
