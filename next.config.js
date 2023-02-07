/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		DATABASE_URL: process.env.DATABASE_URL,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
		S3_URL: process.env.S3_URL,
	},
	images: {
		domains: ['ud-media.s3.us-east-2.amazonaws.com'],
		formats: ['image/avif', 'image/webp'],
	},
	experimental: {
		images: {
			allowFutureImage: true,
		},
	},
};

module.exports = nextConfig;
