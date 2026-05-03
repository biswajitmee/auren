import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, { dev }) {
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/i,
      type: "asset/source"
    });

    if (!dev) {
      config.resolve.alias = {
        ...(config.resolve.alias ?? {}),
        "@theatre/r3f/dist/extension": path.resolve(
          process.cwd(),
          "lib/theatre-r3f-extension-noop.ts"
        ),
        "@theatre/studio": path.resolve(
          process.cwd(),
          "lib/theatre-studio-noop.ts"
        )
      };
    }

    return config;
  }
};

export default nextConfig;
