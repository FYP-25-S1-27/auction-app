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
import { useEffect, useState } from "react";

interface Listing {
  id: number;
  user_uuid: string;
  end_time?: string;
}

interface BidFormModalProps {
  open: boolean;
  onClose: () => void;
  listingId: number;
  listing: Listing;
  onSuccess: () => void;
}

interface User {
  uuid: string;
  is_admin: boolean;
}

const BidFormModal = ({
  open,
  onClose,
  listingId,
  listing,
  onSuccess,
}: BidFormModalProps) => {
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // 🔍 Fetch current user data when modal opens
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };

    if (open) fetchUser();
  }, [open]);

  const handleBid = async () => {
    setError(null);

    // 🛑 Safety checks
    if (!user) {
      setError("User not authenticated.");
      return;
    }

    if (user.is_admin) {
      setError("Admins are not allowed to place bids.");
      return;
    }

    if (user.uuid === listing.user_uuid) {
      setError("You cannot bid on your own listing.");
      return;
    }

    if (listing.end_time && new Date(listing.end_time) < new Date()) {
      setError("Auction has already ended.");
      return;
    }

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

      setBidAmount("");
      onClose();      // 🔐 Only close on success
      onSuccess();    // 🟢 Trigger success handler outside
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
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
