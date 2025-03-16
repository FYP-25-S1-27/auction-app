import { users } from "@/libs/db/schema";
import { db } from "@/libs/db/drizzle";
import { connection } from "next/server";
import { DrizzleError } from "drizzle-orm";
import { auth0management } from "@/libs/actions/auth0";

export default async function Page() {
  await connection(); // Make this page render on request https://nextjs.org/docs/app/api-reference/functions/connection
  async function getUser() {
    "use server";
    try {
      const user = await db.select().from(users).execute();
      return user;
    } catch (error) {
      if (error instanceof DrizzleError) {
        console.error("Error fetching users:", error);
      }
      return [];
    }
  }

  const _users = await getUser();
  const _auth0Users = (await auth0management.users.getAll()).data;
  return (
    <div>
      <h1>Users from Auth0</h1>
      {_auth0Users
        ? _auth0Users.map((u, index) => (
            <div key={index}>
              <h1>
                id: {u.user_id}, username: {u.username}, nickname: {u.nickname}
              </h1>
            </div>
          ))
        : null}
      <h1>Users from Database</h1>
      {_users
        ? _users.map((u, index) => (
            <div key={index}>
              <h1>
                id: {u.uuid}, username: {u.username}
              </h1>
            </div>
          ))
        : null}
    </div>
  );
}
