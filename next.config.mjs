/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/i,
      type: "asset/source"
    });

    return config;
  }
};

export default nextConfig;
