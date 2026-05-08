const siteBasePath = process.env.SITE_BASE_PATH ?? (process.env.GITHUB_PAGES === 'true' ? '/stayorgoab' : '');
const normalizedBasePath = siteBasePath === '/' ? '' : siteBasePath.replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: normalizedBasePath || undefined,
  assetPrefix: normalizedBasePath ? `${normalizedBasePath}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
