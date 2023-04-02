/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['ud-media.s3.us-east-2.amazonaws.com'],
		formats: ['image/avif', 'image/webp'],
		unoptimized: true,
	},
	// matching all API routes
	source: '/api/:path*',
	headers: [
		{ key: 'Access-Control-Allow-Credentials', value: 'true' },
		{ key: 'Access-Control-Allow-Origin', value: ['*', 'https://den-responsive-refactor.d2wd0yag8vomxb.amplifyapp.com'] },
		{ key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
		{ key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
	],
};

module.exports = nextConfig;
