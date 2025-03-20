"use server";
import { auth0management } from "@/libs/actions/auth0-management";

export async function blockUser(uuid: string, blocked: boolean) {
  await auth0management.users.update({ id: uuid }, { blocked });
}
