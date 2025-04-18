"use client";
import { listingCategory } from "@/libs/db/schema";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid2,
  Paper,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { InferSelectModel } from "drizzle-orm";
import { useEffect, useState } from "react";
import * as qs from "qs";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<GetCategories | null>(null);

  const [selectedPriceRange, setSelectedPriceRange] = useState<number[]>([
    initialFilters?.minPrice ?? 0,
    initialFilters?.maxPrice ?? 0,
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categories ? categories.map((category) => category.name) : []
  );

  useEffect(() => {
    if (
      initialFilters?.minPrice !== undefined &&
      initialFilters?.maxPrice !== undefined
    ) {
      setSelectedPriceRange([initialFilters.minPrice, initialFilters.maxPrice]);
    }
  }, [initialFilters?.minPrice, initialFilters?.maxPrice]);
  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Use absolute URL or environment variable
        const response = await fetch(
          `${window.location.origin}/api/categories`
        );
        // Alternative approach using environment variable:
        // const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/categories`);

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    event: Event,
    newValue: number | number[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    activeThumb: number
  ) => {
    if (Array.isArray(newValue)) {
      setSelectedPriceRange(newValue);
    }
  };
  const handleReset = () => {
    //
  };

  const handleSubmit = () => {
    // Get existing search params - remove the leading ? character
    const searchString = window.location.search.substring(1);
    const existingParams = qs.parse(searchString);

    // Merge existing params with new filter values
    const newParams = {
      ...existingParams,
      minPrice: selectedPriceRange[0].toString(),
      maxPrice: selectedPriceRange[1].toString(),
      // Add category when ready
      // category: selectedCategories.join(","),
    };

    // Generate the query string
    const queryString = qs.stringify(newParams);

    window.location.search = queryString;
  };
  return (
    <Paper sx={{ maxWidth: "25rem", minWidth: "20rem", padding: "2rem" }}>
      <FormGroup>
        <form>
          <Typography variant="h4" color="primary">
            Filter by:
          </Typography>
          <Typography>Price</Typography>
          <Slider
            value={selectedPriceRange}
            onChange={handleChange}
            valueLabelDisplay="auto"
            max={initialFilters?.maxPrice || 1000}
            min={initialFilters?.minPrice || 0}
          />
          <Typography>{selectedPriceRange}</Typography>
          <Typography variant="h5" color="primary">
            Category
          </Typography>

          <Grid2 container spacing={1}>
            {isLoading ? (
              <Typography>Loading categories...</Typography>
            ) : categories ? (
              categories.map((category) => {
                return (
                  <Grid2 key={category.name}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label={category.name}
                      sx={{ width: "100%", marginRight: 0, minWidth: "10em" }}
                    />
                  </Grid2>
                );
              })
            ) : null}
          </Grid2>
          <Stack direction={"row"} spacing={2}>
            <Button variant="contained" onClick={handleSubmit}>
              Apply
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              Reset
            </Button>
          </Stack>
        </form>
      </FormGroup>
    </Paper>
  );
}
