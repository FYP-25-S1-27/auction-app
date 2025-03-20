"use client";

import React from "react";
import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";

// Define category colors
const categoryColors = {
  cars: "#7C001F", // Red
  alcohol: "#7C3F00", // Brown
  sports: "#7C5F00", // Greenish-brown
  gadgets: "#007C5F", // Green
  jewellery: "#007C7C", // Teal
  furniture: "#001F7C", // Blue
  watches: "#7C007C", // Magenta
  "event-tickets": "#FF4500", // Orange
  "toys-collectables": "#FFD700", // Yellow
  art: "#8B008B", // Purple
};

function CategorySubcategories({
  subcategories,
  parentSlug,
}: {
  subcategories: Array<string>;
  parentSlug: string;
}) {
  console.log("Subcategories Data:", subcategories); // Debugging log

  // Ensure category color exists, fallback to green if undefined
  const backgroundColor =
    categoryColors[parentSlug?.toLowerCase() as keyof typeof categoryColors] ||
    "#007C5F";

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      gap={2}
      sx={{ mb: 5 }}
    >
      {subcategories.map((sub) => (
        <Link key={sub} href={`/category/${parentSlug}/${sub}`} passHref>
          <Button
            variant="contained"
            sx={{
              backgroundColor, // Dynamic background color
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "8px",
              width: "200px",
              height: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "&:hover": { backgroundColor: "#005A3C" }, // Darken on hover
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontSize: "16px", fontWeight: "bold" }}
            >
              {sub}
            </Typography>
          </Button>
        </Link>
      ))}
    </Box>
  );
}

export default CategorySubcategories;
