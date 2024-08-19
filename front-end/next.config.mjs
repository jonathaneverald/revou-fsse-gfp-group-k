/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "pickbazar-react-rest.vercel.app",
      "images.unsplash.com",
      "themesflat.co",
      "res.cloudinary.com",
      "via.placeholder.com",
    ],
  },
};

export default nextConfig;
