import { Fragment } from "react";
import {
  Container,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      <Drawer variant="permanent">
        <Toolbar />
        <List>
          <ListItem>
            <ListItemButton href="/admin/manage/users">
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton href="/admin/manage/listings">
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Listings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Container>{children}</Container>
    </Fragment>
  );
}
