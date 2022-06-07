import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.body;

	try {
		const post = await prisma.spotlight.delete({
			where: {
				id,
			},
		});
		if (post) {
			res.status(201).json({ message: 'Spotlight Successfully Deleted' });
		}
	} catch (e) {
		res.status(500);
		res.json({ error: 'Internal Server Error Creating User' });
	} finally {
		await prisma.$disconnect();
	}
}
