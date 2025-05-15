import { GetUsers200ResponseOneOfInner } from "auth0";

export type Auth0User = GetUsers200ResponseOneOfInner;

export interface CustomUser extends Auth0User {
  is_admin: boolean;
}
