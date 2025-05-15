/* eslint-disable @next/next/no-img-element */
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
  ImageList,
  ImageListItem,
} from "@mui/material";
import BidFormModal from "./form";
import { GetListingByIdWithImages } from "@/app/api/listings/[id]/route";
import getLatestBids from "@/libs/actions/db/bids/getLatestBids";
// import { useUser } from "@auth0/nextjs-auth0";
// import ChatModal from "@/libs/components/chats/ChatModal";
// import { useRouter } from "next/navigation";

// ✅ Define type before use
interface LatestBid {
  id: number;
  bidAmount: number;
  bidTime: string;
}

const ViewListingPage = () => {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  // const [chatModalOpen, setChatModalOpen] = useState(false);
  const [listing, setListing] = useState<GetListingByIdWithImages | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [bigImage, setBigImage] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [latestBids, setLatestBids] = useState<LatestBid[]>([]);

  const fetchListing = useCallback(async () => {
    try {
      const res = await fetch(`/api/listings/${id}`);
      const data: GetListingByIdWithImages = await res.json();
      setListing(data);

      if (data.end_time && new Date(data.end_time) < new Date()) {
        const bidsRes = await fetch(`/api/listings/${id}/bids`);
        if (bidsRes.ok) {
          const bids = await bidsRes.json();
          if (bids.length > 0) {
            setWinner(bids[0].user_uid);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching listing:", err);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchListing();
  }, [id, fetchListing]);

  useEffect(() => {
    if (id) {
      getLatestBids(parseInt(id as string)).then((bids) => {
        setLatestBids(bids);
      });
    }
  }, [id, showSuccess]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (listing?.end_time) {
        const end = new Date(listing.end_time).getTime();
        const now = new Date().getTime();
        const diff = end - now;

        if (
          diff <= 0 ||
          listing.status?.toUpperCase() !== "ACTIVE" ||
          new Date(listing.end_time) < new Date()
        ) {
          setTimeLeft("Auction Ended");
          clearInterval(interval);
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [listing]);

  const handleBidPlaced = () => {
    fetchListing();
    setModalOpen(false);
  };

  function handleChatClick() {
    // if (user.user?.sub) {
    //   setChatModalOpen(true);
    // } else {
    //   router.push("/auth/login");
    // }
    console.log("Chat click triggered");
  }

  function handlePlaceBidClick() {
    if (user.user?.sub) {
      setModalOpen(true);
    } else {
      router.push("/auth/login");
    }
  }

  if (!listing) return <Typography>Loading...</Typography>;

  const formattedPrice = listing.current_price
    ? `$${listing.current_price}`
    : listing.starting_price
    ? `$${listing.starting_price}`
    : "Price unavailable";

  const formattedEndTime = listing.end_time
    ? new Date(listing.end_time).toLocaleString()
    : "Unknown";

  const auctionEnded = listing.end_time && new Date(listing.end_time) < new Date();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <ImageList cols={2} rowHeight={130} gap={8}>
                {listing.image_urls.map((img: string, i: number) => (
                  <ImageListItem key={i}>
                    <img
                      src={img}
                      alt={listing.name + i}
                      onClick={() => setBigImage(img)}
                      style={{ cursor: "pointer" }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
            <Grid item xs={9}>
              <img
                src={bigImage ?? listing.image_urls[0]}
                alt={listing.name}
                style={{ width: "100%", objectFit: "contain" }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={5}>
          <Typography variant="h5">{listing.name}</Typography>
          <Typography variant="body1" color="textSecondary">
            Category: {listing.category}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Status: {listing.status?.toUpperCase() ?? "Unknown"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Ends at: {formattedEndTime}
          </Typography>
          <Typography variant="body2" color="error" sx={{ fontWeight: "bold" }}>
            {timeLeft}
          </Typography>
          <Typography
            variant="h4"
            color={listing.status === "ACTIVE" ? "primary" : "error"}
            sx={{ mt: 1 }}
          >
            {formattedPrice}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Starting Bid: ${listing.starting_price}
          </Typography>

          <Button
            disabled={
              !listing ||
              !user ||
              listing.status?.toUpperCase() !== "ACTIVE" ||
              new Date(listing.end_time) < new Date() ||
              listing.user_uuid === user.user?.sub
            }
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handlePlaceBidClick}
          >
            Place Bid
          </Button>

          <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography fontWeight="bold">Shipping</Typography>
            <Typography>
              {listing.shipping_fee ? `$${listing.shipping_fee}` : "$10 per order"}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography fontWeight="bold">Delivery</Typography>
            <Typography>
              {listing.delivery_estimate ?? "Estimated between 3–10 business days"}
            </Typography>
          </Box>

          <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography fontWeight="bold">Latest Bids</Typography>
            {latestBids.length > 0 ? (
              latestBids.map((bid) => (
                <Box key={bid.id} sx={{ mt: 1 }}>
                  <Typography>${bid.bidAmount}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(bid.bidTime).toLocaleString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>No bids placed yet.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h6">About this item</Typography>
        <Typography>{listing.description}</Typography>

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
                {listing.seller_bio ?? "Seller description"}
              </Typography>
            </Box>
          </Box>
          <Box mt={2} display="flex" gap={2}>
            <Button variant="contained" onClick={handleChatClick}>
              Contact
            </Button>
          </Box>
        </Box>
      </Box>

      {modalOpen && (
        <BidFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          listingId={Number(id)}
          listing={listing}
          onSuccess={handleBidPlaced}
        />
      )}

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
