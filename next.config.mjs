import createMDX from '@next/mdx'

const withMDX = createMDX({})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.convex.cloud',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
  },
  experimental: {
    mdxRs: true,
  },
}

export default withMDX(nextConfig)
