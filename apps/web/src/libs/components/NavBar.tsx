"use client";
import Image from "next/image";
import logo from "@public/logo.svg";
import NextLink from "next/link";
import {
  TextField,
  Box,
  Link,
  Container,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  Button,
  // Typography,
} from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Fragment, useEffect, useState } from "react";
import { getRole } from "@/libs/actions/db/users";
// import { getListingCategories } from "../actions/db/listing_category";
// import { listing_category } from "../db/schema";

export default function NavBar() {
  const auth = useUser();
  const [is_admin, setis_admin] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?name=${searchQuery}`;
    }
  };

  useEffect(() => {
    if (auth.user) {
      getRole(auth.user.sub).then((x) => {
        if (x[0].is_admin) {
          setis_admin(true);
        } else {
          setis_admin(false);
        }
      });
    }
  }, [auth.user]);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "white",
        pt: 1,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      elevation={0}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <NextLink href="/">
            <Image src={logo} alt="GoGavel logo" width={150} />
          </NextLink>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: "flex",
              flexDirection: "row",
              flexGrow: 1,
              mx: 2,
              gap: 1,
            }}
          >
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />{" "}
            <Button type="submit" variant="contained" color="primary">
              Search
            </Button>
          </Box>
          {auth.isLoading ? (
            <Box component={"div"} sx={{ display: "flex", gap: 2 }}>
              <Link href="/auth/login?screen_hint=signup">Register</Link>
              {/* to be skeleton*/}
              <Link href="/auth/login">Login</Link>
            </Box>
          ) : auth.user ? (
            <PopupState variant="popover" popupId="avatar-menu">
              {(popupState) => (
                <Fragment>
                  {/* Sell & My Listings Links */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <NextLink href="/mylistings" passHref>
                      <span
                        style={{
                          cursor: "pointer",
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        My Listings
                      </span>
                    </NextLink>

                    <NextLink href="/createlisting" passHref>
                      <span
                        style={{
                          cursor: "pointer",
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        Sell
                      </span>
                    </NextLink>
                  </div>

                  {/* User Avatar Menu */}
                  <IconButton {...bindTrigger(popupState)}>
                    <Avatar src={auth.user.picture} alt={auth.user.nickname} />
                  </IconButton>
                  <Menu {...bindMenu(popupState)}>
                    {is_admin && (
                      <MenuItem onClick={popupState.close}>
                        <NextLink href="/admin">Admin Panel</NextLink>
                      </MenuItem>
                    )}
                    <MenuItem onClick={popupState.close}>Profile</MenuItem>
                    <MenuItem onClick={popupState.close}>My account</MenuItem>
                    <MenuItem onClick={popupState.close}>
                      <Link href="/auth/logout" underline="none">
                        Logout
                      </Link>
                    </MenuItem>
                  </Menu>
                </Fragment>
              )}
            </PopupState>
          ) : (
            <Box component={"div"} sx={{ display: "flex", gap: 2 }}>
              <Link href="/auth/login?screen_hint=signup">Register</Link>
              <Link href="/auth/login">Login</Link>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
