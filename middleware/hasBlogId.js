import { prisma } from '../lib/prisma';

const hasBlogId = (handler) => {
	return async(req,res) => {

		try {
			let blogId = req.body.id;
			if(blogId == null || blogId || undefined) {
				throw "Blog entry not found!";
			}
			const blogExists = await prisma.blog.findUnique({
				where:{
					id:blogId
				}
			});
	
			if(blogExists == null || blogExists || undefined) {
				throw "Blog entry not found!";
			}
			return handler(req,res);
		} catch (err) {
			let msg = err.message;
			console.error("Error checking for blogid", msg);
			return res.status(500).send({
				status:500,
				message:msg,
				error:err
			});
		}

	};
}

export default hasBlogId;