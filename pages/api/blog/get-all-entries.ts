import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import prisma from '../../../lib/prisma';

const cors = Cors({
	methods: ['POST', 'GET'],
});

function runMiddleware(
	req: NextApiRequest,
	res: NextApiResponse,
	fn: Function,
) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result: any) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Run the middleware
	await runMiddleware(req, res, cors);

	try {
		const result = await prisma.blog.findMany({
			skip: req.body.skip,
			take: req.body.take,
			orderBy: [
				{
					date: 'desc',
				},
			],
			include: {
				author: {
					select: {
						name: true,
					},
				},
			},
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
