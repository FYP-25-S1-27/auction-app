"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Typography, Select, MenuItem, InputLabel, FormControl
} from "@mui/material";

const EditListing = () => {
  const { id } = useParams();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/viewlistings/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch listing");
        }

        const data = await response.json();
        const formatDateTime = (datetime: string) => {
          return datetime.replace(" ", "T").slice(0, 16);
        };
  
        const formattedData = {
          ...data,
          endTime: data.endTime ? formatDateTime(data.endTime) : "",
          startingPrice: data.startingPrice || "",
        };
        
        setFormData(formattedData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data: { name: string; parent: number | null }[] = await res.json();
        const subcategories = data
        .filter((cat) => cat.parent !== null)
        .map((cat) => cat.name);
  
        setCategories(subcategories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    }; 
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const listingdata = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      starting_price: Number(formData.startingPrice),
      end_time: formData.endTime,
    };

    try {
      const response = await fetch(`/api/updatelisting/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingdata),
      });

      if (!response.ok) {
        throw new Error("Failed to update listing");
      }

      router.push("/mylistings?updated=true");
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

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="categoryLabel">Category</InputLabel>
          <Select
            labelId="categoryLabel"
            name="category"
            value={formData.category || ""}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
          label="End Date and Time"
          fullWidth
          type="datetime-local"
          value={formData.endTime || ""}
          onChange={handleChange}
          sx={{ mt: 3 }}
          InputLabelProps={{ shrink: true }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Update Listing
        </Button>
      </form>
    </Container>
  );
};

export default EditListing;