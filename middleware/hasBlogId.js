import { prisma } from '../lib/prisma';

const hasBlogId = (handler) => {
	return async (req, res) => {
		try {
			const blogId = req.body.id;
			if (blogId == null || blogId === undefined) {
				throw new Error('Blog entry not found!');
			}
			const blogExists = await prisma.blog.findUnique({
				where: {
					id: blogId,
				},
			});

			if (blogExists == null || blogExists === undefined) {
				throw new Error('Blog entry not found!');
			}
			return handler(req, res);
		} catch (err) {
			const msg = err.message;
			return res.status(500).send({
				status: 500,
				message: msg,
				error: err,
			});
		}
	};
};

export default hasBlogId;
