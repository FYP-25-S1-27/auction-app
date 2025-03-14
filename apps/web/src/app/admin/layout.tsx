import { Container } from "@mui/material";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Container>{children}</Container>;
}
