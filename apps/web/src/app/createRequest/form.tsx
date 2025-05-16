"use client";

import { useState, useEffect, ChangeEvent } from "react";
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
  Typography,
} from "@mui/material";

const CreateRequestForm = () => {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categoryList, setCategoryList] = useState<{ name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategoryList(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImages(Array.from(files));
      const preview = URL.createObjectURL(files[0]);
      setPreviewUrl(preview);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("starting_price", budget);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("type", "REQUEST");

      images.forEach((img) => {
        formData.append("image_urls", img); // matches backend
      });

      const res = await fetch("/api/listings", {
        method: "POST",
        body: formData,
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

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            {categoryList.map((cat) => (
              <MenuItem key={cat.name} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box mt={2}>
          <Button variant="outlined" component="label" fullWidth>
            Upload Images (Optional)
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageChange}
            />
          </Button>
        </Box>

        {previewUrl && (
          <Box mt={2}>
            <Typography variant="subtitle2">Preview:</Typography>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}
            />
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
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
