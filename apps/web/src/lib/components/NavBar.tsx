"use client";
import Image from "next/image";
import logo from "@public/logo.svg";
import NextLink from "next/link";
import {
  TextField,
  Box,
  Link,
  InputAdornment,
  Stack,
  Container,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";
import Search from "@mui/icons-material/Search";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Fragment, useEffect, useState } from "react";
import { getRole } from "./action";

export default function NavBar() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const auth = useUser();
  useEffect(() => {
    if (auth.user) {
      getRole(auth.user.sub).then((x) => {
        if (x[0].isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      });
    }
  }, [auth.user]);

  return (
    <Container>
      <Stack
        marginTop={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
        alignContent="center"
        alignSelf="center"
      >
        <NextLink href="/">
          <Image src={logo} alt="GoGavel logo" width={150} />
        </NextLink>
        <TextField
          label="Search"
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
          fullWidth
          sx={{ marginLeft: 2, marginRight: 2 }}
        />
        {auth.isLoading ? (
          <Box component={"div"} sx={{ display: "flex", gap: 2 }}>
            <Link href="/auth/login?screen_hint=signup">Register</Link>{" "}
            {/* to be skeleton*/}
            <Link href="/auth/login">Login</Link>
          </Box>
        ) : auth.user ? (
          // <Avatar src={auth.user.picture} alt={auth.user.nickname} />
          <PopupState variant="popover" popupId="avatar-menu">
            {(popupState) => (
              <Fragment>
                <IconButton {...bindTrigger(popupState)}>
                  <Avatar
                    {...bindTrigger(popupState)}
                    src={auth.user.picture}
                    alt={auth.user.nickname}
                  />
                </IconButton>
                <Menu {...bindMenu(popupState)}>
                  {isAdmin && (
                    <MenuItem onClick={popupState.close}>
                      <NextLink href="/admin">Admin Panel</NextLink>
                    </MenuItem>
                  )}
                  <MenuItem onClick={popupState.close}>Profile</MenuItem>
                  <MenuItem onClick={popupState.close}>My account</MenuItem>
                  <MenuItem onClick={popupState.close}>
                    <NextLink href="/auth/logout">Logout</NextLink>
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
      </Stack>
    </Container>
  );
}
