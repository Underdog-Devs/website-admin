import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	// another common pattern
	// res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
	res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
	);
	try {
		const result = await prisma.blog.findMany({
			orderBy: [
				{
					date: 'desc',
				},
			],
		});
		if (result) {
			res.status(200).json(result);
		} else {
			res.status(500).json({ message: 'Internal Server Error' });
		}
	} catch (error) {
		console.error(error);
	}
}
