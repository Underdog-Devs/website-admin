import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import hasBlogId from '../../../middleware/hasBlogId';

// export default async function (req: NextApiRequest, res: NextApiResponse) {
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { id } = req.body;
	console.log("Hey again. We know it exists, now we'll use it\n\n");
	try {
		const post = await prisma.blog.delete({
			where: {
				id,
			},
		});
		if (post) {
			res.status(201).json({ message: 'Post Successfully Deleted' });
		}
	} catch (e) {
		res.status(500);
		res.json({ error: 'Internal Server Error Deleting A Post' });
	}
}

export default hasBlogId(handler);
