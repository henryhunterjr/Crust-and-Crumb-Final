/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  // Allow framing only by our own sites (Recipe Pantry, the blog, Lovable builds, Skool)
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'self' https://*.bakinggreatbread.com https://bakinggreatbread.com https://*.bakinggreatbread.blog https://bakinggreatbread.blog https://recipepantry.app https://*.recipepantry.app https://*.lovable.app https://*.skool.com",
  },
];

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: __dirname,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
}

module.exports = nextConfig
