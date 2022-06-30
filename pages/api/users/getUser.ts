import { NextApiRequest, NextApiResponse } from 'next';
import RenderResult from 'next/dist/server/render-result';
import prisma from '../../../lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { userId } = req.body;

	try {
		const user = await prisma.user.findUnique({
			where:{
				id:userId
			}
		});
		if(user === null || user === undefined){
			throw "User Not Found";//Possibly make things like this into custom exceptions. Keepem in /utils or /lib?
		}
		console.log("Gotta user!");
		console.log(JSON.stringify(user));
		res.status(200).send({
			status:200,
			message:"User found",
			data:user
		});
	} catch (err) {
		let msg = "Oh no an error while getting a user!!";
		console.error(msg);
		console.error(err);
		res.status(500).send({
			status:500,
			message:msg,
			error:err
		});
	}
}

export default handler;
