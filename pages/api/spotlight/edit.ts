import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const {
		id,
		menteeName,
		portfolioUrl,
		twitterUrl,
		facebookUrl,
		linkedinUrl,
		instagramUrl,
		youtubeUrl,
		imageUrl,
		about } = req.body;

	try {
		const spotlight = await prisma.spotlight.update({
			where: {
				id,
			},
			data: {
				menteeName,
				portfolioUrl,
				twitterUrl,
				facebookUrl,
				linkedinUrl,
				instagramUrl,
				youtubeUrl,
				imageUrl,
				about,
			},
		});
		if (spotlight) {
			res.status(201).json({ message: 'Spotlight Was Edited Successfully' });
		}
	} catch (e) {
		res.status(500);
		res.json({ error: 'Internal Server Error Editing A Spotlight' });
	} finally {
		await prisma.$disconnect();
	}
}
