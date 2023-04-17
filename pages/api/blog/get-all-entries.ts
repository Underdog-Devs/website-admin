import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	// another common pattern
	// res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
	res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
	);
	try {
		const result = await prisma.blog.findMany({
			skip: req.body.skip,
			take: req.body.take,
			orderBy: [
				{
					date: 'desc',
				},
			],
		});
		const postCount = await prisma.blog.count();
		if (result) {
			res.status(200).json({ posts: result, count: postCount });
		} else {
			res.status(500).json({ message: 'Internal Server Error' });
		}
	} catch (error) {
		console.error(error);
	}
}
