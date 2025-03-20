import { GetUsers200ResponseOneOfInner } from "auth0";

export interface CustomUser extends GetUsers200ResponseOneOfInner {
  isAdmin: boolean;
}
