import React from "react";
import { AppBar, Toolbar, Box, InputBase, Container, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: "white", py: 1, borderBottom: "none", boxShadow: "none" }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
          
          {/* Logo Only */}
          <Link href="/" passHref style={{ textDecoration: "none" }}>
            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <Image src="/logo.svg" alt="GoGavel Logo" width={120} height={40} />
            </Box>
          </Link>


          {/* Search Bar */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center", mx: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "80%",
                bgcolor: "#F3F1F1",
                borderRadius: "25px",
                px: 2,
                py: 0.5,
              }}
            >
              <SearchIcon sx={{ color: "gray", mr: 1 }} />
              <InputBase
                placeholder="Search auctions..."
                sx={{ flex: 1, fontSize: "14px", color: "black" }}
              />
            </Box>
          </Box>

          {/* Right Side Options */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ color: "#007C5F", cursor: "pointer" }}>
              Register
            </Typography>
            <Typography variant="body1" sx={{ color: "#007C5F", ml: 2, cursor: "pointer" }}>
              Sign In
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
