import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyPassword } from '../../../lib/auth';
import prisma from '../../../lib/prisma';

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, {
	secret: process.env.JWT_SECRET,
	session: {
		maxAge: 30,
		updateAge: 24,
	},
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: 'Credentials',
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				email: {
					label: 'Email',
					type: 'text',
					placeholder: '',
				},
				password: { label: 'Password', type: 'password' },
			},
			authorize: async (credentials) => {
				// Add logic here to look up the user from the credentials supplied
				const user = await prisma.user.findUnique({
					where: {
						email: credentials?.email,
					},
				});
				if (!user) {
					// If you return null then an error will be displayed advising the user to check their details.
					// You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
					console.log('Error: no user found');
					return null;
				}
				// Any object returned will be saved in `user` property of the JWT
				// Password verification
				if (credentials?.password) {
					const isValid = await verifyPassword(credentials?.password, user?.password);
					if (!isValid) {
						throw new Error('Invalid Credentials');
					}
				}
				console.log('Success');
				return user;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				return {
					...token,
					id: user.id,
				};
			}
			return token;
		},
		async session({ session, token }) {
			// Declare a new variable session copy, return that new variable
			// const session2 = session;
			// session2.accessToken=token.accessToken;

			// return session2;
			session.accessToken = token.accessToken;
			return session;
		},
	},
});
