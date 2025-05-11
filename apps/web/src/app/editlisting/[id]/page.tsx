"use client";

// MIGHT NOT BE USED

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";

interface ListingFormData {
  name: string;
  category: string;
  description: string;
  starting_price: number;
  end_time: string;
}

const EditListingPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<ListingFormData>({
    name: "",
    category: "",
    description: "",
    starting_price: 0,
    end_time: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((res) => res.json())
      .then((data: Partial<ListingFormData>) => {
        setFormData({
          name: data.name || "",
          category: data.category || "",
          description: data.description || "",
          starting_price: data.starting_price || 0,
          end_time: data.end_time || "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update listing");
      }

      router.push("/mylistings");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 3 }}>
        Edit Listing
      </Typography>
      {loading && <CircularProgress sx={{ mt: 3 }} />}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && (
        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            sx={{ mt: 3 }}
          />
          <TextField
            name="category"
            label="Category"
            fullWidth
            value={formData.category}
            onChange={handleChange}
            sx={{ mt: 3 }}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            sx={{ mt: 3 }}
          />
          <TextField
            name="starting_price"
            label="Starting Price"
            fullWidth
            type="number"
            value={formData.starting_price}
            onChange={handleChange}
            sx={{ mt: 3 }}
          />
          <TextField
            name="end_time"
            label="End Time"
            fullWidth
            value={formData.end_time}
            onChange={handleChange}
            sx={{ mt: 3 }}
          />
          <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            Save Changes
          </Button>
        </form>
      )}
    </Container>
  );
};

export default EditListingPage;
