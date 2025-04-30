"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Container, TextField, Button, Typography, Alert } from "@mui/material";

const BidPage = () => {
  const { id } = useParams();
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleBid = async () => {
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: Number(id),
          bid_amount: Number(bidAmount),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to place bid");
      }

      setSuccess(true);
      setBidAmount("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Place Your Bid</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Bid placed successfully!</Alert>}

      <TextField
        fullWidth
        type="number"
        label="Your Bid Amount"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        sx={{ my: 2 }}
      />
      <Button fullWidth variant="contained" onClick={handleBid}>Submit Bid</Button>
    </Container>
  );
};

export default BidPage;
