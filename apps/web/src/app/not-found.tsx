import { Container, Link, Typography } from "@mui/material";
import NextLink from "next/link";

export default async function NotFound() {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" color="primary">
        404 Not Found
      </Typography>
      <Typography variant="subtitle1">
        Could not find requested resource
      </Typography>
      <NextLink href="/">
        <Link component="p">Return Home</Link>
      </NextLink>
    </Container>
  );
}
