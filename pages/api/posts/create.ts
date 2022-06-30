import { NextApiRequest, NextApiResponse } from 'next';
import RenderResult from 'next/dist/server/render-result';
import prisma from '../../../lib/prisma';
import hasAuthour from '../../../middleware/hasAuthour';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	console.log('Loookat meee inside creating a post!\n\n');
	try {
		const {authorId, entry} = req.body;

		/**
		 * Mddleware implementation example here: we would need to know if the
		 * authorId coming in actually belongs to anyone. Just for the sake of a 
		 * simple middleware preview, without authorization/authentication
		 */
		const rezzy = await prisma.blog.create({
			data:{
				authorId: authorId,
				entry: entry
			}
		});

		console.log(JSON.stringify(rezzy));

		res.status(200).send({
			status:200,
			message:"Blog created! Woop Woooooop!"
		});
	} catch (err) {
		console.error("Woopz! ");
		console.error(err);
		res.status(500).send({
			status:500,
			message:"Oh no, an errrur",
			error:err
		})
	}
}

export default hasAuthour(handler);