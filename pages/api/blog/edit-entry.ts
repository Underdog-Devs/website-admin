import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import hasBlogId from '../../../middleware/hasBlogId';
// pages/api/post/index.ts

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const existingUser = await prisma.user.findUnique({
			where: {
				email: req.body.user.email,
			},
		});
		console.log({ existingUser });
		if (existingUser) {
			const result = await prisma.blog.update({
				where: {
					id: req.body.id,
				},
				data: {
					authorId: existingUser.id,
					entry: req.body.entry,
					title: req.body.title,
				},
			});
			console.log({ result });
			if (result) {
				res.status(201).json({ message: 'Entry Updated' });
			} else {
				res.status(500).json({ message: 'Internal Server Error' });
			}
		} else {
			res.status(422).json({ message: 'User Does Not Exist' });
		}
	} catch (error) {
		console.error(error);
	}
};

export default hasBlogId(handler);
