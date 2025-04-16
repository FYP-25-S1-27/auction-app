"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  Alert,
} from "@mui/material";

const CreateRequestForm = () => {
  const [productName, setProductName] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const requestData = {
      name: productName,
      budget: Number(budget),
      description,
      category,
    };

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create request");

      setSuccess(true);
      setProductName("");
      setBudget("");
      setDescription("");
      setCategory("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Create a Product Request
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Request submitted successfully!</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          required
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          required
          label="Budget (SGD)"
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          required
          label="Description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          required
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="Electronics">Electronics</MenuItem>
          <MenuItem value="Books">Books</MenuItem>
          <MenuItem value="Clothing">Clothing</MenuItem>
        </TextField>

        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit Request
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CreateRequestForm;
