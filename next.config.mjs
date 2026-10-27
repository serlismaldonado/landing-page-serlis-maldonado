import createMDX from '@next/mdx'

const withMDX = createMDX({})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    // Convex ya sirve las imágenes desde su CDN, así que re-optimizarlas con
    // /_next/image solo añade latencia y fallos intermitentes (imágenes que
    // "solo cargan tras varias recargas"). Las servimos directo.
    unoptimized: true,
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
