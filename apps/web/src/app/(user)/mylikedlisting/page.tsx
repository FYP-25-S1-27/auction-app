"use client";

import { useEffect, useState } from "react";
import ListingCard from "@/libs/components/listings/ListingCard";
import { Box, Typography, Grid } from "@mui/material";
import { listings } from "@/libs/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Listing = InferSelectModel<typeof listings>;

const MyLikedListings = () => {
    const [userlikedListings, setLikedListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikedListings = async () => {
          try {
            const res = await fetch("/api/listing_likes");
            const data = await res.json();
            setLikedListings(data);
          } catch (err) {
            console.error("Failed to fetch liked listings:", err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchLikedListings();
      }, []);
      
      if (loading) {
        return <Typography>Loading liked listings...</Typography>;
      }
    
      return (
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>
            My Liked Listings
          </Typography>
          <Grid container spacing={2}>
            {userlikedListings.map((listing) => (
              <Grid item xs={11} sm={5} md={3} lg={3} key={listing.id}>
                <ListingCard listing={listing} />
              </Grid>
            ))}
          </Grid>
        </Box>
      );
}

export default MyLikedListings;