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
} from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";
import { useEffect } from "react";
import Search from "@mui/icons-material/Search";

export default function NavBar() {
  const auth = useUser();
  useEffect(() => {
    console.log(auth);
  }, [auth]);
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
            <Link href="/auth/login">Login</Link>
            <Link>Register</Link>
          </Box>
        ) : auth.user ? (
          <Avatar src={auth.user.picture} alt={auth.user.nickname} />
        ) : (
          <Box component={"div"} sx={{ display: "flex", gap: 2 }}>
            <Link href="/auth/login">Login</Link>
            <Link>Register</Link>
          </Box>
        )}
      </Stack>
    </Container>
  );
}
