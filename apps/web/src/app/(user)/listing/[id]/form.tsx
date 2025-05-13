"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

interface BidFormModalProps {
  open: boolean;
  onClose: () => void;
  listingId: number;
  setShowSuccessMessage: Dispatch<SetStateAction<boolean>>;
}

const BidFormModal = ({
  open,
  onClose,
  listingId,
  setShowSuccessMessage,
}: BidFormModalProps) => {
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
          listing_id: listingId,
          bid_amount: Number(bidAmount),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to place bid");
      }

      setSuccess(true);
      setShowSuccessMessage(true);
      setBidAmount("");
      onClose(); // optionally close on success
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Place Your Bid</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Bid placed successfully!
          </Alert>
        )}
        <TextField
          fullWidth
          type="number"
          label="Your Bid Amount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleBid}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BidFormModal;
