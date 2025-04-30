"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Typography, Button, Box, CircularProgress, Alert } from "@mui/material";
import OfferForm from "./offerForm"; // ✅ Import the pop-up form

const ViewRequestPage = () => {
  const { id } = useParams();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openOfferForm, setOpenOfferForm] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (!res.ok) throw new Error("Failed to fetch request");
        const data = await res.json();
        setRequest(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {request && (
        <>
          <Typography variant="h4" gutterBottom>
            {request.name}
          </Typography>
          <Typography variant="h6">Budget: ${request.starting_price}</Typography>
          <Typography>Description: {request.description}</Typography>

          <Button variant="contained" sx={{ mt: 3 }} onClick={() => setOpenOfferForm(true)}>
            Place Offer
          </Button>

          {/* Offer Form Pop-up */}
          <OfferForm
            open={openOfferForm}
            handleClose={() => setOpenOfferForm(false)}
            listingId={request.id}
            requestedPrice={request.starting_price}
          />
        </>
      )}
    </Container>
  );
};

export default ViewRequestPage;
