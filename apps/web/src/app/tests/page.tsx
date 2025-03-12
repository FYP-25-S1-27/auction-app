import { Link } from "@mui/material";

export default async function Page() {
  return (
    <div className="flex flex-row gap-4">
      <Link href="/tests/db">Database</Link>
      <Link href="/tests/socketio">Socket.io</Link>
    </div>
  );
}
