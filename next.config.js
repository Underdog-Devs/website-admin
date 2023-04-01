/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['ud-media.s3.us-east-2.amazonaws.com'],
		formats: ['image/avif', 'image/webp'],
		unoptimized: true,
	},
};

module.exports = nextConfig;
