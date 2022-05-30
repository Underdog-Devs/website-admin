import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '../../../lib/auth';
import prisma from '../../../lib/prisma';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { token, password, email } = req.body;
	const hashedPassword = await hashPassword(password);

	const emailTokenValid = await new Promise((resolve) => {
		// Token verification with the help of JWT
		jwt.verify(token, process.env.JWT_SECRET + email, (err: any) => {
			if (err) resolve(false);
			if (!err) resolve(true);
		});
	});
	// if token is valid, update the user password
	if (emailTokenValid) {
		try {
			// Fetch user by matching the token
			const updateUser = await prisma.user.update({
				where: {
					token,
				},
				data: {
					password: hashedPassword,
					token: null,
				},
			});
			if (updateUser) {
				res.status(201).json({ message: 'Password Successfully Updated' });
			} else {
				res.status(500).json({ error: 'Internal server error updating user password' });
			}
		} catch (e) {
			res.status(500).json({ error: 'Internal server error updating user password' });
		} finally {
			await prisma.$disconnect();
		}
	} else {
		res.status(500).json({ error: 'Internal server error updating user password' });
	}
}
