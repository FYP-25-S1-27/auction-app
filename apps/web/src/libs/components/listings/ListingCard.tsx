"use client";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { listings } from "@/libs/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useEffect, useState } from "react";

type SelectListing = InferSelectModel<typeof listings>;

export default function ListingCard({ listing }: { listing: SelectListing }) {
  const endDateLocale = new Date(listing.endTime).toLocaleString();
  const [imageUrl, setImageUrl] = useState<string>("/images/placeholder.png");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchImage = async (listingId: number) => {
      const response = await fetch(
        `/api/listing_images?listingId=${listingId}`
      );
      const data = await response.json();
      if (data.length > 0) {
        setImageUrl(data[0].imageUrl);
      }
    };

    fetchImage(listing.id);
  }, [listing.id]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`/api/listing_likes?listingId=${listing.id}`);
        const data = await res.json();
        setLiked(data.liked);
      } catch (err) {
        console.error("Failed to fetch like status", err);
      }
    };

    fetchLikes();
  }, [listing.id]);

  const likedListing = async () => {
    const method = liked ? "DELETE" : "POST";

    try {
      const res = await fetch("/api/listing_likes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id }),
      });

      if (res.status === 401) {
        // Redirect to login if never login
        window.location.href = "/auth/login";
        return;
      }

      if (res.ok) {
        setLiked((prev) => !prev);
      } else {
        console.error("Failed to update like");
      }
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: "16rem",
        height: "24rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <IconButton
          onClick={likedListing}
          sx={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            zIndex: 1,
            backgroundColor: "white",
            "&:hover": {
              backgroundColor: "white",
            },
          }}
        >
          {liked ? (
            <Favorite sx={{ color: "#007C5F" }} />
          ) : (
            <FavoriteBorder sx={{ color: "#007C5F" }} />
          )}
        </IconButton>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={listing.name}
          sx={{
            width: "100%", // Make the image take the full width of the card
            minHeight: 140, // Set a fixed height for the image
            objectFit: "cover",
            borderRadius: "0.5rem",
          }}
        />
      </Box>
      <CardContent sx={{ marginTop: "auto" }}>
        <Typography gutterBottom variant="body1" component="div">
          {listing.name}
        </Typography>
        <Typography variant="subtitle2">{listing.category}</Typography>
        <Typography variant="subtitle1">${listing.currentPrice}</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          ${listing.startingPrice}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {endDateLocale}
        </Typography>
      </CardContent>
    </Card>
  );
}
