import { Container } from "@mui/material";
import { connection } from "next/server";

export default async function ManageListingsPage() {
  await connection();

  return (
    <Container>
      <h1>Listings</h1>
    </Container>
  );
}
