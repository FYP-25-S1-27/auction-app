import { users } from "@/libs/db/schema";
import { db } from "@/libs/db/drizzle";
import { connection } from "next/server";
import { DrizzleError } from "drizzle-orm";

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
  return (
    <div>
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
