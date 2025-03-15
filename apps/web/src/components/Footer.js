import React from "react";
import { Box, Typography, Container } from "@mui/material";
import Image from "next/image";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "#F9F9F9", py: 4, mt: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>

          {/* Left Section - Logo & Description */}
          <Box sx={{ maxWidth: "300px" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              {/* ✅ Updated Logo */}
              <Image src="/logo.svg" alt="GoGavel Logo" width={120} height={40} />
            </Box>
            <Typography variant="body2" sx={{ color: "#6F6F6F", mb: 2 }}>
              Participate in online auctions to discover one-of-a-kind treasures and experience
              the thrill of buying and selling.
            </Typography>

            {/* Social Media Icons */}
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <FacebookIcon sx={{ color: "black", fontSize: 28, cursor: "pointer" }} />
              <InstagramIcon sx={{ color: "black", fontSize: 28, cursor: "pointer" }} />
            </Box>

            {/* Copyright */}
            <Typography variant="body2" sx={{ color: "gray" }}>
              © 2025 GoGavel, All Rights Reserved.
            </Typography>
          </Box>

          {/* Right Section - Buy & Sell Links */}
          <Box sx={{ display: "flex", gap: 8 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ color: "#6F6F6F", fontWeight: "bold", mb: 1 }}>
                Buy
              </Typography>
              <Typography variant="body2" sx={{ color: "#6F6F6F", cursor: "pointer" }}>
                How To Buy
              </Typography>
              <Typography variant="body2" sx={{ color: "#6F6F6F", cursor: "pointer" }}>
                Terms of Service
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ color: "#6F6F6F", fontWeight: "bold", mb: 1 }}>
                Sell
              </Typography>
              <Typography variant="body2" sx={{ color: "#6F6F6F", cursor: "pointer" }}>
                How To Sell
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
