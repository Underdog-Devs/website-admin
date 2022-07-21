import prisma from '../lib/prisma';

/**
 * @param {*} handler
 * 
 * 
 */

const hasUser = (handler) =>{
	return async (req,res) => {
		try {
			console.log("Hey look at meee! I'm in a middleware WOOOOOOAAHHHH!!!");
			let userEmail = req.body.user.email;
			const isUser = await prisma.user.findUnique({
				where: {
					email: userEmail
				}
			});
			if(isUser == null || isUser == undefined) {
				throw "User not found.";
			}
			return handler(req,res);
		} catch (err) {
			let msg = err.message;
			console.error("Problem in hasUser: ", msg);
			return res.status(500).send({
				status:500,
				message:msg,
				error:err
			});
		}
	};
}

export default hasUser;