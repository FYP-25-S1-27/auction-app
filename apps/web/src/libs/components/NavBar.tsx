// "use client";
// import Image from "next/image";
// import logo from "@public/logo.svg";
// import NextLink from "next/link";
// import {
//   TextField,
//   Box,
//   Link,
//   InputAdornment,
//   Stack,
//   Container,
//   Avatar,
//   IconButton,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import { useUser } from "@auth0/nextjs-auth0";
// import Search from "@mui/icons-material/Search";
// import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
// import { Fragment, useEffect, useState } from "react";
// import { getRole } from "./action";

// export default function NavBar() {
//   const [is_admin, setis_admin] = useState<boolean>(false);

//   const auth = useUser();
//   useEffect(() => {
//     if (auth.user) {
//       getRole(auth.user.sub).then((x) => {
//         if (x[0].is_admin) {
//           setis_admin(true);
//         } else {
//           setis_admin(false);
//         }
//       });
//     }
//   }, [auth.user]);

//   return (
//     <Container>
//       <Stack
//         marginTop={1}
//         direction="row"
//         alignItems="center"
//         justifyContent="center"
//         alignContent="center"
//         alignSelf="center"
//       >
//         <NextLink href="/">
//           <Image src={logo} alt="GoGavel logo" width={150} />
//         </NextLink>
//         <TextField
//           label="Search"
//           variant="outlined"
//           slotProps={{
//             input: {
//               startAdornment: (
//                 <InputAdornment position="end">
//                   <Search />
//                 </InputAdornment>
//               ),
//             },
//           }}
//           fullWidth
//           sx={{ marginLeft: 2, marginRight: 2 }}
//         />
//         {auth.isLoading ? (
//           <Box component={"div"} sx={{ display: "flex", gap: 2 }}>
//             <Link href="/auth/login?screen_hint=signup">Register</Link>{" "}
//             {/* to be skeleton*/}
//             <Link href="/auth/login">Login</Link>
//           </Box>
//         ) : auth.user ? (
//           // <Avatar src={auth.user.picture} alt={auth.user.nickname} />
//           <PopupState variant="popover" popupId="avatar-menu">
//             {(popupState) => (
//               <Fragment>
//                 {/* To create Listing page */}
//                 <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//                   <NextLink href="/createlisting" passHref>
//                     <span style={{ cursor: "pointer", fontSize: "16px", fontWeight: "bold", color: "#333" }}>Sell</span>
//                   </NextLink>
//                 </div>

//                 <IconButton {...bindTrigger(popupState)}>
//                   <Avatar
//                     {...bindTrigger(popupState)}
//                     src={auth.user.picture}
//                     alt={auth.user.nickname}
//                   />
//                 </IconButton>
//                 <Menu {...bindMenu(popupState)}>
//                   {is_admin && (
//                     <MenuItem onClick={popupState.close}>
//                       <NextLink href="/admin">Admin Panel</NextLink>
//                     </MenuItem>
//                   )}
//                   <MenuItem onClick={popupState.close}>Profile</MenuItem>
//                   <MenuItem onClick={popupState.close}>My account</MenuItem>
//                   <MenuItem onClick={popupState.close}>
//                     <NextLink href="/auth/logout">Logout</NextLink>
//                   </MenuItem>
//                 </Menu>
//               </Fragment>
//             )}
//           </PopupState>
//         ) : (
//           <Box component={"div"} sx={{ display: "flex", gap: 2 }}>
//             <Link href="/auth/login?screen_hint=signup">Register</Link>
//             <Link href="/auth/login">Login</Link>
//           </Box>
//         )}
//       </Stack>
//     </Container>
//   );
// }

"use client";
import Image from "next/image";
import logo from "@public/logo.svg";
import NextLink from "next/link";
import {
  TextField,
  Box,
  Link,
  InputAdornment,
  Container,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  // Typography,
} from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";
import Search from "@mui/icons-material/Search";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Fragment, useEffect, useState } from "react";
import { getRole } from "@/libs/actions/db/users";
// import { getListingCategories } from "../actions/db/listing_category";
// import { listing_category } from "../db/schema";

export default function NavBar() {
  const [is_admin, setis_admin] = useState<boolean>(false);
  // const [categories, setCategories] = useState<
  //   (typeof listing_category.$inferSelect)[]
  // >([]);
  const auth = useUser();

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

    // getListingCategories().then((x) => {
    //   // append the categories to the state
    //   setCategories(x);
    // });
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
          {/* <Box sx={{ marginLeft: 2 }}>
            <PopupState variant="popover" popupId="categories-menu">
              {(popupState) => (
                <Fragment>
                  <IconButton {...bindTrigger(popupState)}>
                    <Typography>Categories</Typography>
                  </IconButton>
                  <Menu {...bindMenu(popupState)}>
                    {categories.map((category) => (
                      <MenuItem key={category.name} onClick={popupState.close}>
                        <NextLink href={`/category/${category.name}`} passHref>
                          <span style={{ color: "#333" }}>{category.name}</span>
                        </NextLink>
                      </MenuItem>
                    ))}
                  </Menu>
                </Fragment>
              )}
            </PopupState>
          </Box> */}
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
