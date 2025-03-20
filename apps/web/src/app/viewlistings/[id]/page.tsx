"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";

const EditListing = () => {
  const { id } = useParams();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/viewlistings/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch listing");
        }

        const data = await response.json();
        setFormData(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/updatelisting/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update listing");
      }

      router.push("/mylistings");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 3 }}>
        Edit Listing
      </Typography>

      {loading && <CircularProgress sx={{ mt: 3 }} />}
      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Name"
          fullWidth
          value={formData.name || ""}
          onChange={handleChange}
          sx={{ mt: 3 }}
        />

        <TextField
          name="category"
          label="Category"
          fullWidth
          value={formData.category || ""}
          onChange={handleChange}
          sx={{ mt: 3 }}
        />

        <TextField
          name="description"
          label="Description"
          fullWidth
          value={formData.description || ""}
          onChange={handleChange}
          sx={{ mt: 3 }}
          multiline
          rows={3}
        />

        <TextField
          name="startingPrice"
          label="Starting Price"
          fullWidth
          type="number"
          value={formData.startingPrice || ""}
          onChange={handleChange}
          sx={{ mt: 3 }}
        />

        <TextField
          name="endTime"
          label="End Time"
          fullWidth
          value={formData.endTime || ""}
          onChange={handleChange}
          sx={{ mt: 3 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Save Changes
        </Button>
      </form>
    </Container>
  );
};

export default EditListing;
