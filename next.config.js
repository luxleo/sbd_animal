/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	async rewrites() {
		return [
			{
				//NOTE: in rewrites function, there is no 'permanent' key
				source: '/verification_code',
				destination: `http://localhost:8000/accounts/verification_code/`,
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8000',
				pathname: '/accounts/**',
			},
		],
		domains: ['https://sbd-animal-bucket.s3.amazonaws.com'],
	},
};

module.exports = nextConfig;
