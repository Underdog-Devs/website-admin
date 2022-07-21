import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import hasUser from '../../../middleware/hasUser';
// pages/api/post/index.ts

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
	const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {

		console.log("Hey now look at meee! Ishould be in create-entry!");
		let existingUser = req.body.user;
		console.log({ existingUser });
		if (existingUser) {
			const result = await prisma.blog.create({
				data: {
					authorId: existingUser.id,
					entry: req.body.entry,
					title: req.body.title,
				},
			});
			console.log({ result });
			if (result) {
				res.status(201).json({ message: 'Entry Created' });
			} else {
				res.status(500).json({ message: 'Internal Server Error' });
			}
		} else {
			res.status(422).json({ message: 'User Does Not Exist' });
		}
	} catch (error) {
		console.error(error);
	}
}

export default hasUser(handler);