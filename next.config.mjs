/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    domains: ["res.cloudinary.com", "localhost"],
  },
};

export default nextConfig;
