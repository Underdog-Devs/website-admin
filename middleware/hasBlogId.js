import prisma from '../lib/prisma';
const hasBlogId = (handler) => {
	return async (req,res) => {
		try {
			const blogEntryExists = await prisma.blog.findUnique({
				where:{
					id:req.body.id
				}
			});
			console.log("Blog ID Eggsists: ");
			console.log(JSON.stringify(blogEntryExists));

			return handler(req,res);
		} catch (err) {
			let msg = "Omg nooo blogId doesn't exist!!! :(";
			console.error(msg);

			return res.status(500).send({
				status:500,
				message:msg,
				error:err
			});

		}
	};
}

export default hasBlogId;