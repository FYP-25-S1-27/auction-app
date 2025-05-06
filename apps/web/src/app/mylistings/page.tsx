"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import NextLink from "next/link";

interface Listing {
  id: number;
  name: string;
  category: string;
  current_price?: number;
  starting_price: number;
  end_time: string;
}

const MyListingsPage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/mylistings");
        if (!res.ok) throw new Error("Failed to load listings");
        const data = await res.json();
        setListings(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete listing");

      setListings((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }    
  };

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Listings
      </Typography>
      <Grid container spacing={3}>
        {listings.map((listing) => (
          <Grid item xs={12} md={6} key={listing.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{listing.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {listing.category}
                </Typography>
                <Typography>
                  Price: ${listing.current_price || listing.starting_price}
                </Typography>
                <Typography>
                  Ends at: {new Date(listing.end_time).toLocaleString()}
                </Typography>
                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                  <NextLink href={`/editlisting/${listing.id}`} passHref>
                    <Button variant="outlined">Edit</Button>
                  </NextLink>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(listing.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyListingsPage;
