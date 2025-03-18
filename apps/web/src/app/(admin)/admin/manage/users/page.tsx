import { auth0management } from "@/libs/actions/auth0-management";
import { CustomAdminUserDataGrid } from "@/libs/components/admin/CustomAdminDataGrid";
import { db } from "@/libs/db/drizzle";
import { users } from "@/libs/db/schema";
import { CustomUser } from "@/libs/types/users";
import { Container, Paper, Typography } from "@mui/material";
import { connection } from "next/server";

export default async function UsersPage() {
  await connection();

  const getUsersRepsonse = auth0management.users.getAll();
  const auth0users = (await getUsersRepsonse).data || [];
  const dbUsers = await db
    .select({
      uuid: users.uuid,
      isAdmin: users.isAdmin,
      username: users.username,
    })
    .from(users);
  // Merge the two lists of users using uuid as the key
  const _users: CustomUser[] = auth0users.map((auth0user) => {
    const dbUser = dbUsers.find((dbUser) => dbUser.uuid === auth0user.user_id);
    return {
      ...auth0user,
      isAdmin: dbUser?.isAdmin ?? false,
      username: dbUser?.username ?? "",
    };
  });

  return (
    <Container sx={{ ml: 2 }}>
      <Typography variant="h4">Manage Users</Typography>
      <Paper>
        <CustomAdminUserDataGrid users={_users} />
      </Paper>
    </Container>
  );
}
