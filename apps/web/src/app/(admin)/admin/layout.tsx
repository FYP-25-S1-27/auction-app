import { Fragment } from "react";
import { Box } from "@mui/material";
import ResponsiveDrawer from "@/libs/components/admin/CustomResponsiveDrawer";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      <ResponsiveDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: `240px` },
        }}
      >
        {children}
      </Box>
    </Fragment>
  );
}
