import prisma from '../lib/prisma';

/**
 * @param {*} handler
 *
 *
 */

const hasUser = (handler) => {
	return async (req, res) => {
		try {
			const userEmail = req.body.user.email;
			if (userEmail == null || userEmail === undefined) {
				throw new Error('User not found.');
			}
			const isUser = await prisma.user.findUnique({
				where: {
					email: userEmail,
				},
			});
			if (isUser == null || isUser === undefined) {
				throw new Error('User not found.');
			}
			/**
			 * Here, once we know user exists; do we want to
			 * make the user db obj result part of the req instead on whats being sent from the FE?
			 *
			 * e.g. Operations needing a valid user will need to pass in user:{email:<String>}
			 * this should be checked by our wicked awesome 'hasUser middleware' if the user exists,
			 * we can then assign the user obj to the req.
			 * req.body.user = resultFromQueryingUserTable;
			 *  So diffrent endpoints can use email or id properties
			 * of a user.
			 */
			return handler(req, res);
		} catch (err) {
			const msg = err.message;
			console.error('Problem in hasUser: ', msg);
			return res.status(500).send({
				status: 500,
				message: msg,
				error: err,
			});
		}
	};
};

export default hasUser;
