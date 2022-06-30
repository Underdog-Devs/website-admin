import prisma from '../lib/prisma';
const hasAuthour = (handler) => {
	return async (req,res) => {
		try {
			const isUser = await prisma.user.findUnique({
				where:{
					id:req.body.id
				}
			});
		} catch (err) {
			let msg = "Omg nooo arthur doesn't exist!!! :(";
			console.error(msg);

			return res.status(500).send({
				status:500,
				message:msg,
				error:err
			});
		}
	};
}

export default hasAuthour;