import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	try {
		const spotlight = await prisma.spotlight.findMany();
		if (spotlight) {
			res.status(200).json({ spotlight });
		}
	} catch (e) {
		res.status(500);
		res.json({ error: 'Internal Server Error Requesting Spotlights' });
	} finally {
		await prisma.$disconnect();
	}
}
