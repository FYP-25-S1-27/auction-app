"use client";  

import React from "react";
import { useRouter } from "next/navigation";  
import { Box, Typography } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import DevicesIcon from "@mui/icons-material/Devices";
import DiamondIcon from "@mui/icons-material/Diamond";
import WeekendIcon from "@mui/icons-material/Weekend";
import WatchIcon from "@mui/icons-material/Watch";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ToysIcon from "@mui/icons-material/Toys";
import PaletteIcon from "@mui/icons-material/Palette";

const categories = [
  { name: "Cars", slug: "cars", icon: <DirectionsCarIcon /> },
  { name: "Alcohol", slug: "alcohol", icon: <SportsBarIcon /> },
  { name: "Sports", slug: "sports", icon: <SportsSoccerIcon /> },
  { name: "Gadgets", slug: "gadgets", icon: <DevicesIcon /> },
  { name: "Jewellery", slug: "jewellery", icon: <DiamondIcon /> },
  { name: "Furniture", slug: "furniture", icon: <WeekendIcon /> },
  { name: "Watches", slug: "watches", icon: <WatchIcon /> },
  { name: "Event Tickets", slug: "event-tickets", icon: <ConfirmationNumberIcon /> },
  { name: "Toys & Collectables", slug: "toys-collectables", icon: <ToysIcon /> },
  { name: "Art", slug: "art", icon: <PaletteIcon /> },
];

const CategoryBar = () => {
  const router = useRouter();  

  const handleCategoryClick = (slug) => {
    router.push(`/category/${slug}`);  
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 2, mt: -1 }}>
      {categories.map((category, index) => (
        <Box
          key={index}
          onClick={() => handleCategoryClick(category.slug)}  
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mx: 2,
            cursor: "pointer",
            color: "#6f6f6f",
            transition: "color 0.3s ease",
            "&:hover": { color: "#007C5F" },
          }}
        >
          {category.icon}
          <Typography variant="body2" sx={{ mt: 0.5, fontSize: "12px" }}>
            {category.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CategoryBar;