import { NextApiRequest, NextApiResponse } from 'next';
import { v4 } from 'uuid';
import prisma from '../../../lib/prisma';
import hasUser from '../../../middleware/hasUser';

// pages/api/post/index.ts

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		console.log('Hey now look at meee! Ishould be in create-entry!');
		console.log(req.body);
		const existingUser = req.body.user;
		if (existingUser) {
			const result = await prisma.blog.create({
				data: {
					id: v4(),
					authorId: existingUser.id,
					entry: req.body.entry,
					title: req.body.title,
					firstParagraph: req.body.firstParagraph,
					date: new Date(),
					image: req.body.image,
				},
			});
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
};

export default hasUser(handler);
