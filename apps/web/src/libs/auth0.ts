import { Auth0Client } from "@auth0/nextjs-auth0/server";

// const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
// const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
// const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
// const AUTH0_SECRET = process.env.AUTH0_SECRET;
// const APP_BASE_URL = process.env.APP_BASE_URL;
// if (!AUTH0_DOMAIN || AUTH0_DOMAIN === "") {
//   throw new Error("Missing AUTH0_DOMAIN in environment variables");
// }
// if (!AUTH0_CLIENT_ID || AUTH0_CLIENT_ID === "") {
//   throw new Error("Missing AUTH0_CLIENT_ID in environment variables");
// }
// if (!AUTH0_CLIENT_SECRET || AUTH0_CLIENT_SECRET === "") {
//   throw new Error("Missing AUTH0_CLIENT_SECRET in environment variables");
// }
// if (!AUTH0_SECRET || AUTH0_SECRET === "") {
//   throw new Error("Missing AUTH0_SECRET in environment variables");
// }
// if (!APP_BASE_URL || APP_BASE_URL === "") {
//   throw new Error("Missing APP_BASE_URL in environment variables");
// }

export const auth0 = new Auth0Client();
