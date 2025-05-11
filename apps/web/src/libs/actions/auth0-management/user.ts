"use server";

import { getAuth0ManagementClient } from ".";

const auth0management = getAuth0ManagementClient();
export async function blockUser(uuid: string, blocked: boolean) {
  await auth0management.users.update({ id: uuid }, { blocked });
}
