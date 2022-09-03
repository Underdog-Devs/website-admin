import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { hashPassword } from '../../../lib/auth';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { credentials } = req.body;
	const { email, password } = credentials;
	// email and password validation
	if (!email || !email.includes('@') || !password || password.trim().length < 7) {
		res
			.status(422)
			.json({
				message: 'Invalid input - password should be at least 7 characters long',
			});
		return;
	}

	const existingUser = await prisma.user.findUnique({
		where: {
			email,
		},
	});
	// check if user exists
	if (existingUser) {
		res.status(422).json({ message: 'User Already Exists' });
	}

	const hashedPassword = await hashPassword(password);

	try {
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				userType: 'admin',
			},
		});
		if (user) {
			res.status(201).json({ message: 'User Created' });
		}
	} catch (e) {
		res.status(500);
		res.json({ error: 'Internal Server Error Creating User' });
	} finally {
		await prisma.$disconnect();
	}
}
