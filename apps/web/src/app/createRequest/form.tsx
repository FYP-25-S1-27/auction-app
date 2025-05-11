"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material";

const CreateRequestForm = () => {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [category] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const requestData = {
      name: productName,
      starting_price: Number(budget),
      description,
      category,
      listing_types: "REQUEST", // ✅ Important for requests
    };

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create request");

      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <h2>Create Product Request</h2>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Budget (SGD)"
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            // onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
            //   setCategory(e.target.value as string)
            // }

            // commented above temporarily to build properly @azwssoh001 please fix
            required
          >
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Books">Books</MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit Request"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CreateRequestForm;
