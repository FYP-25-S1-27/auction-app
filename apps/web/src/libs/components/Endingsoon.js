"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const EndingSoon = () => {
  const [listings, setListings] = useState([]); // Ensure listings is initialized as an array
  const [currentPage, setCurrentPage] = useState(0);
  const [timeLeft, setTimeLeft] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch Listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/endingsoon");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched data:", data);
        if (Array.isArray(data)) {
          setListings(data);
          updateTimers(data); // Initialize countdowns
        } else {
          console.error("API response is not an array:", data);
        }
      } catch (error) {
        console.error("Failed to fetch 'ending soon' listings:", error);
      }
    };

    fetchListings();
  }, []);

  // ⏳ Countdown Timer - Updates every second
  useEffect(() => {
    const interval = setInterval(() => {
      updateTimers(listings);
      setCurrentTime(new Date()); // Update current time every second
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [listings]);

  // Update Countdown Timers for Each Listing
  const updateTimers = (listings) => {
    const now = new Date().getTime();
    const newTimeLeft = {};

    listings.forEach((listing) => {
      const end = new Date(listing.end_time).getTime();
      const difference = end - now;

      if (difference <= 0) {
        newTimeLeft[listing.id] = "Auction Ended";
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        newTimeLeft[listing.id] = `${hours}h ${minutes}m ${seconds}s`;
      }
    });

    setTimeLeft(newTimeLeft);
  };

  // Pagination
  const listingsPerPage = 5;
  const totalPages = Math.min(8, Math.ceil(listings.length / listingsPerPage));

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 >= 0 ? prev - 1 : totalPages - 1));
  };

  return (
    <Box sx={{ py: 6 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: "bold",
          color: "#007C5F",
          textAlign: "center",
        }}
      >
        Current Time: {currentTime.toLocaleString()}
      </Typography>

      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: "bold", color: "#007C5F" }}
      >
        Auctions Ending Soon
      </Typography>

      {/* Listings Grid */}
      <Grid container spacing={3} sx={{ alignItems: "center" }}>
        {/* Previous Button */}
        <Grid item>
          <IconButton onClick={handlePrev} sx={{ color: "#007C5F" }}>
            <ArrowBackIosNewIcon />
          </IconButton>
        </Grid>

        {/* Listings Display */}
        {Array.isArray(listings) && listings.length > 0 ? (
          listings
            .slice(
              currentPage * listingsPerPage,
              (currentPage + 1) * listingsPerPage
            )
            .map((listing, index) => {
              const isEndingSoon =
                timeLeft[listing.id] &&
                timeLeft[listing.id] !== "Auction Ended" &&
                listing.end_time - new Date().getTime() < 24 * 60 * 60 * 1000;

              return (
                <Grid item xs={12} sm={6} md={2.4} key={index}>
                  <Card sx={{ boxShadow: 3 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={"/images/placeholder.png"}
                      alt={listing.name}
                    />
                    <CardContent>
                      <Typography variant="body1">{listing.name}</Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Current Bid: ${listing.current_price}
                      </Typography>
                      {/* ⏳ Countdown Timer (Text turns red when less than 24 hours left) */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "bold",
                          color: isEndingSoon ? "red" : "black",
                        }}
                      >
                        Time Left: {timeLeft[listing.id]}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
        ) : (
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            No listings available.
          </Typography>
        )}

        {/* Next Button */}
        <Grid item>
          <IconButton onClick={handleNext} sx={{ color: "#007C5F" }}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EndingSoon;
