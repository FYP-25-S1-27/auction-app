"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";

const BidPage = () => {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [listing, setListing] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bids, setBids] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placingBid, setPlacingBid] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isLessThanDay, setIsLessThanDay] = useState<boolean>(false);

  // Function to fetch listing and bid history
  const fetchData = async () => {
    setLoading(true);
    try {
      const listingResponse = await fetch(`/api/listings/${id}`);
      if (!listingResponse.ok) throw new Error("Failed to fetch listing");
      const listingData = await listingResponse.json();
      setListing(listingData);
      updateTimeLeft(listingData.end_time); // Initialize countdown

      const bidsResponse = await fetch(`/api/bids/${id}`);
      if (!bidsResponse.ok) throw new Error("Failed to fetch bid history");
      const bidsData = await bidsResponse.json();
      setBids(bidsData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch listing & bid history on mount
  useEffect(() => {
    fetchData();
  });

  // ⏳ Countdown Timer
  useEffect(() => {
    if (listing?.end_time) {
      const interval = setInterval(
        () => updateTimeLeft(listing.end_time),
        1000
      );
      return () => clearInterval(interval); // Cleanup
    }
  }, [listing]);

  const updateTimeLeft = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const difference = end - now;

    if (difference <= 0) {
      setTimeLeft("Auction Ended");
      setIsLessThanDay(false);
      return;
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    setIsLessThanDay(difference < 24 * 60 * 60 * 1000); // Less than 24 hours
  };

  // Function to place a bid
  const handleBid = async () => {
    setPlacingBid(true);
    setError(null);

    try {
      const response = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: Number(id),
          bid_amount: Number(bidAmount),
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to place bid");
      }

      setBidAmount(""); // Reset bid input
      await fetchData(); // ✅ Refresh listing & bid history after successful bid
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPlacingBid(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 5, mt: 3 }}>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {listing && (
        <>
          <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
            Place a Bid!
          </Typography>
          <Typography variant="h5">Listing: {listing.name}</Typography>
          <Typography>Category: {listing.category}</Typography>
          <Typography>Starting Price: ${listing.starting_price}</Typography>
          <Typography>
            Current Price: ${listing.current_price || listing.starting_price}
          </Typography>

          {/* 🕒 Countdown Timer with Dynamic Color */}
          <Typography
            variant="h6"
            sx={{ mt: 2, color: isLessThanDay ? "red" : "black" }}
          >
            Time Left: {timeLeft}
          </Typography>

          <TextField
            label="Bid Amount"
            type="number"
            fullWidth
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleBid}
            disabled={placingBid || !bidAmount}
            sx={{ mt: 2 }}
          >
            {placingBid ? "Placing Bid..." : "Place Bid"}
          </Button>

          <Typography variant="h5" sx={{ mt: 4 }}>
            Bid History
          </Typography>
          <List>
            {bids.length > 0 ? (
              bids.map((bid) => (
                <ListItem key={bid.id}>
                  <ListItemText
                    primary={`$${bid.bid_amount}`}
                    secondary={`User: ${bid.user_uuid}`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography>No bids placed yet.</Typography>
            )}
          </List>
        </>
      )}
    </Container>
  );
};

export default BidPage;