"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const OfferForm = ({
  open,
  handleClose,
  listingId,
  requestedPrice,
}: {
  open: boolean;
  handleClose: () => void;
  listingId: number;
  requestedPrice: number;
}) => {
  const [customOffer, setCustomOffer] = useState("");
  const [quantity, setQuantity] = useState("1");

  const submitOffer = async (price: number) => {
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listingId,
          offer_price: price,
          quantity: Number(quantity),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit offer");
      alert("Offer submitted!");
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Submit an Offer</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>Buyer Requested Price: ${requestedPrice}</Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{ mb: 2 }}
          onClick={() => submitOffer(requestedPrice)}
        >
          Match Offer
        </Button>

        <Typography align="center" gutterBottom>or</Typography>

        <TextField
          label="Custom Offer Price"
          type="number"
          fullWidth
          sx={{ mb: 2 }}
          value={customOffer}
          onChange={(e) => setCustomOffer(e.target.value)}
        />

        <TextField
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => submitOffer(Number(customOffer))} variant="contained">
          Submit Offer
        </Button>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OfferForm;
