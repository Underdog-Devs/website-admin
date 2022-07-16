import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
// pages/api/post/index.ts

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	try {
		const result = await prisma.blog.findUnique({
			where: {
				id: 'cl5o3jpyv00661v32o7mzc3nb',
			},
		});
		console.log({ result });
		if (result) {
			res.status(200).json(result);
		} else {
			res.status(500).json({ message: 'Internal Server Error' });
		}
	} catch (error) {
		console.error(error);
	}
}
