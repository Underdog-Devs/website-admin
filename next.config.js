/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		DATABASE_URL: process.env.DATABASE_URL,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
	},
	images: {
		loader: 'akamai',
		path: '',
	},
};

module.exports = nextConfig;
