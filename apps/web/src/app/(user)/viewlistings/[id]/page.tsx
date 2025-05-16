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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Checkbox,
} from "@mui/material";
import { listings } from "@/libs/db/schema";
import { createClient } from "@/libs/supabase/client";

const EditListing = () => {
  const supabase = createClient();
  const { id } = useParams();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const res = await fetch(`/api/listing_images?listingId=${id}`);
      const data = await res.json();
      if (data.length > 0) {
        setImageUrl(data[0].imageUrl);
      }
    };

    if (listings?.id) {
      fetchImage();
    }
  }, [id]);

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
          status: data.status,
          startTime: data.startTime ? formatDateTime(data.startTime) : "",
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
        const data: { name: string; parent: number | null }[] =
          await res.json();
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
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "isSold") {
      setFormData({ ...formData, status: checked ? "SOLD" : formData.status });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(formData.startTime) > new Date(formData.endTime)) {
      setError("Scheduled time cannot be later than the end time.");
      return;
    }

    const priceNumber = parseInt(formData.startingPrice, 10);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      alert("Starting price must be a positive whole number!");
      return;
    }

    let uploadedImageUrl = imageUrl;

    // If a new image is selected
    if (formData.newImage) {
      const file = formData.newImage;
      const fileExt = file.name.split(".").pop();
      const fileName = `${id}-${Date.now()}.${fileExt}`;
      const filePath = `listing-images/${fileName}`;

      // Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });
      if (uploadError) {
        alert("Image upload failed.");
        return;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from("listing-images")
        .getPublicUrl(filePath);
      uploadedImageUrl = data.publicUrl;
    }

    const payload = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      starting_price: Number(formData.startingPrice),
      end_time: formData.endTime,
      start_time: formData.startTime,
      status: formData.status,
      image_url: uploadedImageUrl,
    };

    console.log(payload);

    try {
      const response = await fetch(`/api/updatelisting/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update listing");
      }

      router.push("/mylistings?updated=true");
    } catch (error) {
      console.error("❌ Error updating form:", error);
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
        {imageUrl && (
          /* eslint-disable @next/next/no-img-element */
          <img
            src={imageUrl}
            alt="Listing Image"
            style={{
              width: "400px",
              height: "400px",
              objectFit: "cover",
              marginBottom: "1rem",
            }}
          />
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}>
          <Typography variant="h6">Replace Image: </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFormData({ ...formData, newImage: e.target.files[0] });
              }
            }}
          />
        </Box>

        <TextField
          name="name"
          label="Name"
          fullWidth
          value={formData.name || ""}
          onChange={handleChange}
          sx={{ mt: 3 }}
          required
        />

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="categoryLabel">Category</InputLabel>
          <Select
            labelId="categoryLabel"
            name="category"
            value={formData.category || ""}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
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
          required
        />

        <TextField
          name="startingPrice"
          label="Starting Price"
          fullWidth
          type="number"
          value={formData.startingPrice || ""}
          onChange={handleChange}
          sx={{ mt: 3 }}
          required
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
          required
        />

        {/* if listing is scheduled, scheduled time appear */}
        {formData.startTime && new Date(formData.startTime) > new Date() && (
          <TextField
            name="startTime"
            label="Scheduled Time"
            fullWidth
            type="datetime-local"
            value={formData.startTime || ""}
            onChange={handleChange}
            sx={{ mt: 3 }}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: new Date().toISOString().slice(0, 16),
            }}
            required
          />
        )}
        <div>
          <span>Mark as Sold?</span>
          <Checkbox name="isSold" onChange={handleChange} />
        </div>

        <Button
          variant="outlined"
          color="secondary"
          sx={{ mt: 3, mr: 2 }}
          onClick={() => router.push("/mylistings")}
        >
          Cancel
        </Button>
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
