"use client";
import React, { useState } from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { listings as _listings } from "../../db/schema";
import ListingCard from "./ListingCard";

type ListingType = typeof _listings.$inferSelect;

export default function ListingCarousel({
  listings,
  title,
}: {
  listings: ListingType[];
  title: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + itemsPerPage, listings.length - itemsPerPage)
    );
  };

  const visibleItems = listings.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        {title}
      </Typography>
      <Stack direction={"row"} alignItems={"center"}>
        {/* Left Arrow */}
        <IconButton
          onClick={handlePrev}
          disabled={currentIndex === 0}
          color="primary"
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Listings */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          sx={{
            flexGrow: 1,
            mx: 2,
          }}
        >
          {visibleItems.map((item, index) => (
            <ListingCard key={index} listing={item} />
          ))}
        </Stack>

        {/* Right Arrow */}
        <IconButton
          onClick={handleNext}
          disabled={currentIndex + itemsPerPage >= listings.length}
          color="primary"
        >
          <ArrowForwardIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
