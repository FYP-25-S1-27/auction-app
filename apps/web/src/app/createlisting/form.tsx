/* eslint-disable @next/next/no-img-element */
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
  Switch,
  Alert,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import Image from "next/image";

// const [files, setFiles] = useState<File[]>([]); // REMOVE IF NOT NEEDED

const ListingForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(null);
  const [scheduled, setScheduled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [start_time, setstart_time] = useState<dayjs.Dayjs | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (Number(startingPrice) < 0) {
      setError("Starting price cannot be negative.");
      setLoading(false);
      return;
    }
    if (endTime && endTime.isBefore(dayjs())) {
      setError("End time cannot be before the current time.");
      setLoading(false);
      return;
    }
    if (scheduled) {
      if (!start_time || start_time.isBefore(dayjs())) {
        setError("Scheduled listings must have a start time in the future.");
        return;
      }
      if (endTime && (start_time.isAfter(endTime) || start_time.isSame(endTime))) {
        setError("Scheduled time must be before end time.");
        return;
      }
    }

    const endTimeString = endTime ? endTime.toDate().toISOString() : null;

    const listingData = {
      name,
      category,
      condition,
      description,
      starting_price: Number(startingPrice),
      end_time: endTimeString,
      scheduled,
      listing_types: "LISTING",
    };

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

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
    <Container maxWidth="md">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Create New Listing
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

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
        {/* 
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
              sx={{ width: 100, height: 100, borderRadius: 2, overflow: "hidden", boxShadow: 1 }}
            >
              <Image
                src={URL.createObjectURL(file)}
                alt={file.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          ))}
        </Box>
        */}
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Listing Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
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

        <FormControl fullWidth margin="normal">
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

        <TextField
          label="Starting Price"
          type="number"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Auction End Time"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
          />
        </LocalizationProvider>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <p>Schedule Your Listing</p>
          <Switch checked={scheduled} onChange={(e) => setScheduled(e.target.checked)} />
        </Box>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Listing Start Time"
            value={start_time}
            onChange={(newValue) => setstart_time(newValue)}
            disabled={!scheduled}
          />
        </LocalizationProvider>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "List Now"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ListingForm;
