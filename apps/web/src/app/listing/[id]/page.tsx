"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import BidFormModal from "./form";

// ✅ Interface for listing
interface Listing {
  id: number;
  name: string;
  description: string;
  starting_price: number;
  current_price?: number;
  end_time?: string;
  image_urls?: string[];
  shipping_fee?: number;
  delivery_estimate?: string;
  seller_name?: string;
  seller_description?: string;
}

const ViewListingPage = () => {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [listing, setListing] = useState<Listing | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ useCallback ensures stable function reference
  const fetchListing = useCallback(async () => {
    try {
      const res = await fetch(`/api/listings/${id}`);
      const data: Listing = await res.json();
      console.log("📦 Updated listing data:", data);
      setListing(data);
    } catch (err) {
      console.error("Error fetching listing:", err);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchListing();
  }, [id, fetchListing]);

  const handleBidPlaced = () => {
    fetchListing();
    setModalOpen(false);
    setShowSuccess(true);
  };

  if (!listing) return <Typography>Loading...</Typography>;

  const formattedPrice =
    listing.current_price !== undefined
      ? `$${listing.current_price.toLocaleString()}`
      : listing.starting_price !== undefined
      ? `$${listing.starting_price.toLocaleString()}`
      : "Price unavailable";

  const formattedEndTime = listing.end_time
    ? new Date(listing.end_time).toLocaleString()
    : "Unknown";

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {/* Left: Images */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              {(listing.image_urls || [1, 2, 3, 4]).map((img, i) => (
                <Box key={i} mb={2}>
                  <Paper
                    sx={{
                      height: 60,
                      backgroundColor: "#eee",
                      backgroundImage:
                        typeof img === "string" ? `url(${img})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </Box>
              ))}
            </Grid>
            <Grid item xs={9}>
              <Paper
                sx={{
                  height: 400,
                  backgroundColor: "#ddd",
                  backgroundImage: listing.image_urls?.[0]
                    ? `url(${listing.image_urls[0]})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Right: Info */}
        <Grid item xs={12} md={5}>
          <Typography variant="h5">{listing.name}</Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Ends at: {formattedEndTime}
          </Typography>
          <Typography variant="h4" color="error">
            {formattedPrice}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {listing.description}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => setModalOpen(true)}
          >
            Place Bid
          </Button>

          <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography fontWeight="bold">Shipping</Typography>
            <Typography>
              {listing.shipping_fee !== undefined
                ? `$${listing.shipping_fee}`
                : "$10 per order"}
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Typography fontWeight="bold">Delivery</Typography>
            <Typography>
              {listing.delivery_estimate ??
                "Estimated between Tue, 1 Mar and Wed, 7 Mar"}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Description */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6">About this item</Typography>
        <Typography>{listing.description}</Typography>

        {/* Seller Info */}
        <Box
          sx={{
            mt: 4,
            p: 2,
            backgroundColor: "#f9f9f9",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">About this seller</Typography>
          <Box display="flex" alignItems="center" gap={2} mt={2}>
            <Paper sx={{ width: 50, height: 50, borderRadius: "50%" }} />
            <Box>
              <Typography>{listing.seller_name ?? "Unknown Seller"}</Typography>
              <Typography variant="body2" color="textSecondary">
                {listing.seller_description ?? "Seller description"}
              </Typography>
            </Box>
          </Box>
          <Box mt={2} display="flex" gap={2}>
            <Button variant="outlined">Other Products</Button>
            <Button variant="contained">Contact</Button>
          </Box>
        </Box>
      </Box>

      {/* Bid Modal */}
      <BidFormModal
        open={modalOpen}
        onClose={handleBidPlaced}
        listingId={Number(id)}
      />

      {/* Snackbar for Success */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Your bid was successfully placed!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ViewListingPage;
