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
  const noOfPages = Math.ceil(listings.length / itemsPerPage);
  // Create padded array of listings
  const paddedListings = [...listings];
  const remainingSlots = itemsPerPage - (listings.length % itemsPerPage);
  // Only pad if we need to (when listings length is not divisible by itemsPerPage)
  if (remainingSlots !== itemsPerPage) {
    for (let i = 0; i < remainingSlots; i++) {
      paddedListings.push({
        id: -1,
        userUuid: "",
        category: "",
        name: "NIL",
        description: null,
        startingPrice: 0,
        currentPrice: null,
        type: "LISTING",
        endTime: "",
        startTime: null,
        status: null,
        createdAt: "",
      });
    }
  }
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + itemsPerPage, paddedListings.length - itemsPerPage)
    );
  };

  const visibleItems = paddedListings.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <Box marginTop={"1rem"} marginBottom={"3rem"}>
      <Stack direction={"column"} pl={"3.5rem"} gap={"0.5rem"} mb={"0.5rem"}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <Stack direction={"row"} gap={"0.5rem"}>
          {[...Array(noOfPages)].map((_, index) => (
            <Box
              component={"button"}
              key={index}
              pl={"3.5rem"}
              bgcolor={
                index <= Math.floor(currentIndex / itemsPerPage)
                  ? "#007C5F"
                  : "#6F6F6F"
              }
              // width={"2px"}
              height={"8px"}
              onClick={() => {
                setCurrentIndex(index * itemsPerPage);
              }}
              type={"button"}
            />
          ))}
        </Stack>
      </Stack>
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
