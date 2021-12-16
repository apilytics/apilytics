/* eslint @typescript-eslint/no-var-requires: "off" */
const { withPlausibleProxy } = require('next-plausible');

/** @type {import('next').NextConfig} */
module.exports = withPlausibleProxy()({
  env: {
    BUILD_DATE: process.env.BUILD_DATE,
  },
  reactStrictMode: true,
});
