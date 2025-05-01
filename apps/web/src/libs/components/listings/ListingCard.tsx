"use client";

import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { listings } from "@/libs/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useEffect, useState } from "react";

type SelectListing = InferSelectModel<typeof listings>;

export default function ListingCard({ listing }: { listing: SelectListing }) {
  const endDateLocale = new Date(listing.endTime).toLocaleString();
  const [imageUrl, setImageUrl] = useState<string>("/images/placeholder.png");

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

  return (
    <Card
      sx={{
        maxWidth: "16rem",
        height: "24rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
