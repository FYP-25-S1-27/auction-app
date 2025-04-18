"use client";

import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { listings } from "@/libs/db/schema";
import { InferSelectModel } from "drizzle-orm";

type SelectListing = InferSelectModel<typeof listings>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ListingCard({ listing }: { listing: SelectListing }) {
  const endDateLocale = new Date(listing.endTime).toLocaleString();

  return (
    <Card sx={{ maxWidth: 240 }}>
      <CardMedia
        component="img"
        image={"/images/placeholder.png"}
        alt={listing.name}
      />
      <CardContent>
        <Typography gutterBottom variant="body1" component="div">
          {listing.name}
        </Typography>
        <Typography variant="subtitle1">${listing.currentPrice}</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          ${listing.startingPrice}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {endDateLocale}
        </Typography>
        {/* <Typography variant="subtitle1">{listing.users.username}</Typography> */}
      </CardContent>
    </Card>
  );
}
