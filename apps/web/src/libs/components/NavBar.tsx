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
import { useSearchParams } from "next/navigation";
import getWalletBalance from "../actions/db/wallet/getWalletBalance";
// import { getListingCategories } from "../actions/db/listing_category";
// import { listing_category } from "../db/schema";

export default function NavBar() {
  const searchParams = useSearchParams();
  const auth = useUser();
  const [is_admin, setis_admin] = useState<boolean>(false);
  const [searchNameQuery, setSearchNameQuery] = useState<string>("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchNameQuery.trim()) {
      window.location.href = `/search?name=${searchNameQuery}`;
    }
  };
  const [walletBalance, setWalletBalance] = useState<number>(0);

  const [auctionMenuAnchorEl, setAuctionMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const [reverseAuctionMenuAnchorEl, setReverseAuctionMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  useEffect(() => {
    if (auth.user) {
      getRole(auth.user.sub).then((x) => {
        if (x[0].is_admin) {
          setis_admin(true);
        } else {
          setis_admin(false);
        }
      });
      getWalletBalance(auth.user.sub).then((balance) =>
        setWalletBalance(balance)
      );
    }
    const x = searchParams.get("name");
    if (x) {
      setSearchNameQuery(x);
    }
  }, [auth.user, searchParams]);

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
              value={searchNameQuery}
              onChange={(e) => setSearchNameQuery(e.target.value)}
            />
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
            <Fragment>
              {/* Sell & My Listings Links */}
              {!is_admin && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    alignContent: "center",
                    textAlign: "center",
                    gap: "16px",
                  }}
                >
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
                  <NextLink href="/createRequest" passHref>
                    <span
                      style={{
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      Request
                    </span>
                  </NextLink>
                  <span
                    style={{
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                    onClick={(e) => setAuctionMenuAnchorEl(e.currentTarget)}
                  >
                    Auction
                  </span>
                  <Menu
                    id="auction-menu"
                    anchorEl={auctionMenuAnchorEl}
                    open={Boolean(auctionMenuAnchorEl)}
                    onClose={() => setAuctionMenuAnchorEl(null)}
                  >
                    <MenuItem onClick={() => setAuctionMenuAnchorEl(null)}>
                      <NextLink href="/mylistings">My Listings</NextLink>
                    </MenuItem>
                    <MenuItem onClick={() => setAuctionMenuAnchorEl(null)}>
                      <NextLink href={"/mybids"}>My Bids</NextLink>
                    </MenuItem>
                  </Menu>
                  <span
                    style={{
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                    onClick={(e) =>
                      setReverseAuctionMenuAnchorEl(e.currentTarget)
                    }
                  >
                    Reverse Auction
                  </span>
                  <Menu
                    id="reverse-auction-menu"
                    anchorEl={reverseAuctionMenuAnchorEl}
                    open={Boolean(reverseAuctionMenuAnchorEl)}
                    onClose={() => setReverseAuctionMenuAnchorEl(null)}
                  >
                    <MenuItem
                      onClick={() => setReverseAuctionMenuAnchorEl(null)}
                    >
                      <NextLink href="/myrequests">My Requests</NextLink>
                    </MenuItem>
                    <MenuItem
                      onClick={() => setReverseAuctionMenuAnchorEl(null)}
                    >
                      <NextLink href={"/myoffers"}>My Offers</NextLink>
                    </MenuItem>
                  </Menu>

                  <NextLink href="/chats" passHref>
                    <span
                      style={{
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      Chats
                    </span>
                  </NextLink>
                  <NextLink href={"/wallet"}>
                    <span
                      style={{
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      ${walletBalance}
                    </span>
                  </NextLink>
                </div>
              )}
              <PopupState variant="popover" popupId="avatar-menu">
                {(popupState) => (
                  <Fragment>
                    {/* User Avatar Menu */}
                    <IconButton {...bindTrigger(popupState)}>
                      <Avatar
                        src={auth.user.picture}
                        alt={auth.user.nickname}
                      />
                    </IconButton>
                    <Menu {...bindMenu(popupState)}>
                      {is_admin && (
                        <MenuItem onClick={popupState.close}>
                          <NextLink href="/admin">Admin Panel</NextLink>
                        </MenuItem>
                      )}
                      <MenuItem onClick={popupState.close}>
                        <NextLink href="/demo_profile">Profile</NextLink>
                      </MenuItem>
                      {!is_admin && (
                        <MenuItem onClick={popupState.close}>
                          <NextLink href="/mylikedlisting">My Likes</NextLink>
                        </MenuItem>
                      )}
                      <MenuItem onClick={popupState.close}>
                        <Link href="/auth/logout">Logout</Link>{" "}
                        {/* Only this link is NOT to use NextLink */}
                        {/* https://github.com/auth0/nextjs-auth0 */}
                        {/* You must use <a> tags instead of the <Link> component to ensure that the routing is not done client-side as that may result in some unexpected behavior. */}
                      </MenuItem>
                    </Menu>
                  </Fragment>
                )}
              </PopupState>
            </Fragment>
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
