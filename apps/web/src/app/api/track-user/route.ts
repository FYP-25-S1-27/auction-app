import { auth } from '@auth0/nextjs-auth0';
import { insertUser } from '@/libs/actions/db/users';

export async function GET() {
  const session = await auth();
  const user = session?.user;

  if (user) {
    await insertUser(user.sub, user.nickname);
  }

  return new Response('OK');
}
