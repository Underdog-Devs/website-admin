import sendgrid from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { email } = req.body;
	const { sign } = jwt;
	// Sign the token with JWT
	const token = sign({ email }, process.env.NEXT_PUBLIC_SECRET + email, {
		expiresIn: '1d',
	});

	try {
		// Pass the token to the DB
		await prisma.user.update({
			where: {
				email,
			},
			data: {
				token,
			},
		});

		sendgrid.setApiKey((process.env.SENDGRID_API_KEY as string));

		try {
			await sendgrid.send({
				to: email,
				from: 'underdogdevsteam@gmail.com',
				subject: 'Reset Password Request',
				html: `<div>
                <p></p>
                <p><a href="${process.env.NEXTAUTH_URL}/user/reset-password/${token}">${process.env.NEXTAUTH_URL}/user/reset-password/${token}</a></p>
                <p></p>
                <p></p>
                <hr></hr>
                <p>To restore access to the site, follow the link.</p>
                <p><a href="${process.env.NEXTAUTH_URL}/user/reset-password/${token}">${process.env.NEXTAUTH_URL}/user/reset-password/${token} </a></p>
                <p>Link is active for 24 hours.</p>
                <p>If you received this email in error, just delete it.</p>            
                </div>
                </div>`,
			});
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
		res.status(201).json({ message: 'Password Reset Message Sent' });
	} catch (e) {
		res.status(500);
		console.error(e);
		res.json({ message: 'Internal Server Error Sending Reset Message' });
	}
}
