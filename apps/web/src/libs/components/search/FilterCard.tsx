"use client";
import { listingCategory } from "@/libs/db/schema";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  TextField,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { InferSelectModel } from "drizzle-orm";
import { useEffect, useState } from "react";
import qs from "qs";
import { useSearchParams } from "next/navigation";

interface FilterProps {
  initialFilters?: {
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    status?: string;
  };
  // onFilterChange?: (filters: any) => void;
}

type GetCategories = InferSelectModel<typeof listingCategory>[];

export default function FilterCard({ initialFilters }: FilterProps) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<GetCategories | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? searchParams.get("category")!.split(",") : []
  );

  const [selectedPriceRange, setSelectedPriceRange] = useState<number[]>([
    Number(searchParams.get("minPrice")) || initialFilters?.minPrice || 0,
    Number(searchParams.get("maxPrice")) || initialFilters?.maxPrice || 1000,
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${window.location.origin}/api/categories`
        );
        const data: GetCategories = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category) // Remove if already selected
          : [...prev, category] // Add if not selected
    );
  };

  const handleReset = () => {
    setSelectedPriceRange([
      initialFilters?.minPrice ?? 0,
      initialFilters?.maxPrice ?? 0,
    ]);
    setSelectedCategories([]);
  };

  const handleSubmit = () => {
    const existingParams = Object.fromEntries(searchParams.entries());

    const newParams = {
      ...existingParams, // Preserve existing query parameters
      minPrice: selectedPriceRange[0].toString(), // Update minPrice
      maxPrice: selectedPriceRange[1].toString(), // Update maxPrice
      category: selectedCategories.join(","), // Include selected categories
    };

    const queryString = qs.stringify(newParams);
    window.location.search = queryString; // Update the query string
  };

  return (
    <Box sx={{ maxWidth: "30rem", minWidth: "25rem" }}>
      <FormGroup>
        <form>
          <Typography variant="h4" color="primary">
            Filter by
          </Typography>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="price-content"
              id="price-header"
            >
              <Typography variant="h5" color="primary">
                Price
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Slider
                  valueLabelDisplay="auto"
                  value={selectedPriceRange}
                  onChange={(e, newValue) =>
                    Array.isArray(newValue) && setSelectedPriceRange(newValue)
                  }
                  max={initialFilters?.maxPrice || 1000}
                  min={initialFilters?.minPrice || 0}
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Min Price"
                    type="number"
                    value={selectedPriceRange[0]}
                    onChange={(e) => {
                      const newMin = Math.min(
                        Number(e.target.value),
                        selectedPriceRange[1]
                      );
                      setSelectedPriceRange([newMin, selectedPriceRange[1]]);
                    }}
                    fullWidth
                  />
                  <TextField
                    label="Max Price"
                    type="number"
                    value={selectedPriceRange[1]}
                    onChange={(e) => {
                      const newMax = Math.max(
                        Number(e.target.value),
                        selectedPriceRange[0]
                      );
                      setSelectedPriceRange([selectedPriceRange[0], newMax]);
                    }}
                    fullWidth
                  />
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="category-content"
              id="category-header"
            >
              <Typography variant="h5" color="primary">
                Category
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={5}>
                {isLoading ? (
                  <Typography>Loading categories...</Typography>
                ) : categories ? (
                  categories.map((category) => (
                    <Grid key={category.name}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedCategories.includes(category.name)}
                            onChange={() => handleCategoryChange(category.name)}
                          />
                        }
                        label={category.name}
                        sx={{ width: "100%", marginRight: 0, minWidth: "10em" }}
                      />
                    </Grid>
                  ))
                ) : (
                  <Typography>No categories available</Typography>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Stack direction={"row"} spacing={2} marginTop={"1rem"}>
            <Button variant="contained" onClick={handleSubmit}>
              Apply
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              Reset
            </Button>
          </Stack>
        </form>
      </FormGroup>
    </Box>
  );
}
