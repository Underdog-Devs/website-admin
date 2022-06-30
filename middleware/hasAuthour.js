import prisma from '../lib/prisma';
/**
 * 
 * @param {*} handler 
 * Will probably need to rename this
 * to a more generic 'userExists' or something.
 * If we're to reuse this, names should be the same
 * accross the application(assuming authorId=userId)
 */
const hasAuthour = (handler) => {
	return async (req,res) => {
		console.log("Inside hasAuthor middleware!!!\n\n");
		try {
			/**
			 * Before we just go call the DB, we can do preliminary
			 * in-code checks. Like is the incoming autohrId null, if so
			 * don't even call the db, and return. No sense in wasting network time
			 * &db resources on looking for a null user.
			 */
			const isUser = await prisma.user.findUnique({
				where:{
					id:req.body.authorId
				}
			});
			if(isUser === null || isUser === undefined){
				throw "User Not Found";//Possibly make things like this into custom exceptions. Keepem in /utils or /lib?
			}
			console.log("User exists!!\nWe can now continue\n\n");
			return handler(req,res);
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