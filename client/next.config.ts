import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
  // serverActions: {
  //   bodySizeLimit: '100mb'
  // },
  reactStrictMode: false,
  experimental:{
    serverActions: {
      bodySizeLimit: '1000mb',
    }
  }
  
};

export default nextConfig;


/** @type {import('next').NextConfig} */
 
// module.exports = {
//   experimental: {
//     serverActions: {
//       bodySizeLimit: '2mb',
//     },
//   },
// }