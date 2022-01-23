/* eslint @typescript-eslint/no-var-requires: "off" */
const { withPlausibleProxy } = require('next-plausible');

// Reason for this dance is that Vercel bot links preview environments in pull requests
// as: `https://apilytics-git-branchname-apilytics.vercel.app` but the only URL environment
// variable it provides (VERCEL_URL/NEXT_PUBLIC_VERCEL_URL) points to the unique deployment id
// instead of the branch name and looks like `apilytics-abdhtrgha-apilytics.vercel.app `.
// So we manually create the branch name env variable here. Without this, we would not be able to
// log in with next-auth from the preview branch URL linked in the PR comments.
// Info: https://vercel.com/docs/concepts/projects/environment-variables
let NEXTAUTH_URL;
if (process.env.NEXTAUTH_URL) {
  NEXTAUTH_URL = process.env.NEXTAUTH_URL;
} else if (process.env.NEXT_PUBLIC_VERCEL_URL && process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF) {
  NEXTAUTH_URL = process.env.NEXT_PUBLIC_VERCEL_URL.replace(
    /^([^-]+-)([^-]+)(.*)$/,
    `https://$1git-${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF}$3`,
  );

  if (NEXTAUTH_URL.split('.')[0].replace('https://', '').length > 63) {
    // If the resulting subdomain is more than 63 characters, Vercel in reality has truncated it
    // and the URL we formed is no longer valid. In these cases we really can't do much more than
    // to just fall back on the deployment URL, since we cannot know the hash Vercel inserts into
    // the end of the URL (it comes from the branch name and project name, but the implementation
    // is not public and might not be stable).
    // Info: https://vercel.com/docs/concepts/deployments/automatic-urls#truncation
    NEXTAUTH_URL = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
} else {
  throw new Error(
    'Missing value for NEXTAUTH_URL or NEXT_PUBLIC_VERCEL_URL and NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF env variable(s).',
  );
}

/** @type {import('next').NextConfig} */
module.exports = withPlausibleProxy()({
  env: {
    // We need both; the first one is read by next-auth and is only exposed to the backend.
    // The second one is used by our frontend code and is exposed to the browser.
    NEXTAUTH_URL,
    NEXT_PUBLIC_FRONTEND_URL: NEXTAUTH_URL,
  },
  reactStrictMode: true,
});
