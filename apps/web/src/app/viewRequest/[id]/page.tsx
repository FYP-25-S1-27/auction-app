"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import OfferForm from "./offerForm";

const ViewRequestPage = () => {
  const { id } = useParams();
  const [request, setRequest] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOfferForm, setShowOfferForm] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(`/api/requests/${id}`);
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

  const handleOpenOfferForm = () => setShowOfferForm(true);
  const handleCloseOfferForm = () => setShowOfferForm(false);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            {request.name}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Category: {request.category}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Description: {request.description}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Budget: ${request.starting_price}
          </Typography>

          <Box>
            <Button variant="contained" color="primary" onClick={handleOpenOfferForm}>
              Make an Offer
            </Button>
          </Box>

          {showOfferForm && (
            <OfferForm
              requestId={request.id}
              matchAmount={request.starting_price}
              onClose={handleCloseOfferForm}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default ViewRequestPage;