/** @type {import("next").NextConfig} */
const config = {
  publicRuntimeConfig: {
    APP_URL: process.env.APP_URL,
    WS_URL: process.env.WS_URL,
  },
};
export default config;
