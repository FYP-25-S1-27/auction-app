"use client";

import { useEffect, useState, ChangeEvent } from "react";
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
        formData.append("image_urls", img);
      });

      const res = await fetch("/api/listings", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create request");

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Create Product Request
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            border: "2px dashed #ccc",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            mb: 3,
          }}
        >
          <label htmlFor="image-upload">
            <Typography>Drag and drop images here, or click to select images</Typography>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageChange}
            />
          </label>
        </Box>

        {previewUrl && (
          <Box mt={2}>
            <Typography variant="subtitle2">Preview:</Typography>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}
            />
          </Box>
        )}

        <TextField
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Budget"
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
