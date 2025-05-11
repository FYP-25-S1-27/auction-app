/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  TextField,
  Button,
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Switch,
  Alert,
  Typography,
  Snackbar,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { InferSelectModel } from "drizzle-orm";
import { listingCategory } from "@/libs/db/schema";
import { createClient } from "@/libs/supabase/client";

const ListingForm = () => {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [starting_price, setstarting_price] = useState("");
  const [end_time, setend_time] = useState<dayjs.Dayjs | null>(null);
  const [start_time, setstart_time] = useState<dayjs.Dayjs | null>(null); // ADDED THIS LINE
  const [scheduled, setScheduled] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [categoryHierarchy, setCategoryHierarchy] = useState<
    CategoriesSchema[]
  >([]);

  // Get all categories
  type CategoriesSchema = InferSelectModel<typeof listingCategory>;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data: CategoriesSchema[] = await response.json();
          const hierarchical = data.filter((cat) => cat.parent !== null);
          setCategoryHierarchy(hierarchical);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file) => {
        const randomNumber = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999

        const { data, error } = await supabase.storage
          .from("listing-images")
          .upload(`${randomNumber + file.name}`, file, {
            upsert: false, // prevent overwriting
          });
        if (error) {
          if (error.message.includes("already exists")) {
            const { data: publicUrlData } = supabase.storage
              .from("listing-images")
              .getPublicUrl(file.name);
            setFiles((prev) => [...prev, publicUrlData.publicUrl]);
            return;
          }
        } else {
          const { data: publicUrlData } = supabase.storage
            .from("listing-images")
            .getPublicUrl(data.path);
          setFiles((prev) => [...prev, publicUrlData.publicUrl]);
        }
      });
    },
    [supabase.storage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Reset errors on new submit

    // **Validation Checks**
    if (Number(starting_price) < 0) {
      setError("Starting price cannot be negative.");
      return;
    }
    if (end_time && end_time.isBefore(dayjs())) {
      setError("End time cannot be before the current time.");
      return;
    }
    if (scheduled) {
      if (!start_time || start_time.isBefore(dayjs())) {
        setError("Scheduled listings must have a start time in the future.");
        return;
      }
      if (
        end_time &&
        (start_time.isAfter(end_time) || start_time.isSame(end_time))
      ) {
        setError("Scheduled time must be before end time.");
        return;
      }
    }

    // ✅ Convert scheduled time and end_time to a proper ISO string before sending
    const end_timeString = end_time ? end_time.toDate().toISOString() : null;
    const start_timeString = start_time
      ? start_time.toDate().toISOString()
      : null; // ADD

    const priceNumber = Number(starting_price);
    if (!Number.isInteger(priceNumber)) {
      alert("Starting price must be a whole number!");
      return;
    }

    // Prepare form data for file upload
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("description", description);
    formData.append("starting_price", String(priceNumber));
    formData.append("end_time", end_timeString || ""); // Send as string, handle null
    formData.append("scheduled", String(scheduled));
    if (scheduled) {
      formData.append("start_time", start_timeString || "");
    }

    // Append files to form data
    files.forEach((file) => {
      formData.append("image_urls", file);
    });

    console.log("📩 Submitting Form Data with Files");

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create listing");
      }

      const data = await response.json();
      console.log("✅ Server Response:", data);
      setShowSuccess(true);
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      setError("Failed to create listing");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Create New Listing
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {/* success message */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={5000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowSuccess(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Listing has created successfully!
          </Alert>
        </Snackbar>

        <h2>UPLOAD PHOTOS AND VIDEO</h2>
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed #aaa",
            padding: "30px",
            borderRadius: "8px",
            textAlign: "center",
            cursor: "pointer",
            background: isDragActive ? "#f0f0f0" : "#fafafa",
            mb: 3,
          }}
        >
          <input {...getInputProps()} />
          <Typography color="text.secondary">
            Drag and drop images here, or click to select images
          </Typography>
        </Box>

        <Box display="flex" gap={2} flexWrap="wrap">
          {files.map((file, i) => (
            <Box
              key={i}
              position="relative"
              sx={{
                width: 100,
                height: 100,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 1,
              }}
            >
              <img
                src={file}
                alt={file}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <TextField
          label="Listing Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        {/* Category */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Item Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryHierarchy.map((cat) => (
              <MenuItem key={cat.name} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Condition */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Item Condition</InputLabel>
          <Select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="used">Used</MenuItem>
            <MenuItem value="heavily_used">Heavily Used</MenuItem>
          </Select>
        </FormControl>
        {/* Condition Description */}
        <TextField
          label="Condition Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
          margin="normal"
          multiline
          rows={3}
        />
        {/* Starting Price */}
        <TextField
          label="Starting Price"
          type="number"
          value={starting_price}
          onChange={(e) => setstarting_price(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        {/* End Time */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Auction End Time"
            value={end_time}
            onChange={(newValue) => setend_time(newValue)}
            slotProps={{
              textField: { required: true },
            }}
          />
        </LocalizationProvider>
        {/* Schedule Toggle */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <p>Schedule Your Listing</p>
          <Switch
            checked={scheduled}
            onChange={(e) => setScheduled(e.target.checked)}
          />
        </Box>
        {/* Scheduled Start Time (ADDED THIS) */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Listing Start Time"
            value={start_time}
            onChange={(newValue) => setstart_time(newValue)}
            disabled={!scheduled} // disable the field if not scheduled
          />
        </LocalizationProvider>
        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="contained" color="primary" type="submit">
            List Now
          </Button>
        </Box>
        &nbsp;
      </form>
    </Container>
  );
};

export default ListingForm;
