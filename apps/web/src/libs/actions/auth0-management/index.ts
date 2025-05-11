import { ManagementClient } from "auth0";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
if (!AUTH0_DOMAIN || AUTH0_DOMAIN === "") {
  throw new Error("Missing AUTH0_DOMAIN in environment variables");
}
if (!AUTH0_CLIENT_ID || AUTH0_CLIENT_ID === "") {
  throw new Error("Missing AUTH0_CLIENT_ID in environment variables");
}
if (!AUTH0_CLIENT_SECRET || AUTH0_CLIENT_SECRET === "") {
  throw new Error("Missing AUTH0_CLIENT_SECRET in environment variables");
}

export const auth0management = new ManagementClient({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  clientSecret: AUTH0_CLIENT_SECRET,
});
