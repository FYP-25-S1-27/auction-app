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
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
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
type ListingStatus = "ACTIVE" | "SOLD";
type SortOption = "priceAsc" | "priceDesc" | "endTimeAsc" | "endTimeDesc";

function buildCategoryHierarchy(categories: GetCategories) {
  // Find all root categories (with null parent)
  const rootCategories = categories.filter((cat) => cat.parent === null);

  // Create the hierarchy
  return rootCategories.map((parent) => ({
    ...parent,
    children: categories.filter((cat) => cat.parent === parent.name),
  }));
}

type ExtendedListingStatus = ListingStatus | "ENDED";

export default function FilterCard({ initialFilters }: FilterProps) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categoryHierarchy, setCategoryHierarchy] = useState<
    ReturnType<typeof buildCategoryHierarchy>
  >([]);
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("orderBy") as SortOption) || "endTimeAsc"
  );
  const [selectedStatuses, setSelectedStatuses] =
    useState<ExtendedListingStatus>(
      (searchParams.get("status") as ExtendedListingStatus) || "ACTIVE"
    );

  const [selectedPriceRange, setSelectedPriceRange] = useState<number[]>([
    Number(searchParams.get("minPrice")) || initialFilters?.minPrice || 0,
    Number(searchParams.get("maxPrice")) || initialFilters?.maxPrice || 1000,
  ]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? searchParams.get("category")!.split(",") : []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${window.location.origin}/api/categories`
        );
        const data: GetCategories = await response.json();
        const hierarchical = buildCategoryHierarchy(data);
        setCategoryHierarchy(hierarchical);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleStatusChange = (status: ExtendedListingStatus) => {
    setSelectedStatuses(status);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category) // Remove if already selected
          : [...prev, category] // Add if not selected
    );
  };

  const handleReset = () => {
    setSelectedStatuses("ACTIVE");
    setSelectedPriceRange([
      initialFilters?.minPrice ?? 0,
      initialFilters?.maxPrice ?? 0,
    ]);
    setSelectedCategories([]);
    setSortBy("endTimeAsc");
  };

  const handleSubmit = () => {
    const existingParams = Object.fromEntries(searchParams.entries());

    const newParams = {
      ...existingParams, // Preserve existing query parameters
      minPrice: selectedPriceRange[0].toString(), // Update minPrice
      maxPrice: selectedPriceRange[1].toString(), // Update maxPrice
      category: selectedCategories.join(","), // Include selected categories
      ...(selectedStatuses.length > 0 && {
        status: selectedStatuses,
      }),
      orderBy: sortBy,
    };

    const queryString = qs.stringify(newParams);
    window.location.search = queryString; // Update the query string
  };

  return (
    <Box sx={{ maxWidth: "30rem", minWidth: "25rem" }}>
      <FormGroup>
        <form>
          <Box sx={{ mt: 2, mb: 2 }}>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <MenuItem value="priceAsc">Price: Asc</MenuItem>
              <MenuItem value="priceDesc">Price: Desc</MenuItem>
              <MenuItem value="endTimeAsc">End Date: Asc</MenuItem>
              <MenuItem value="endTimeDesc">End Date: Desc</MenuItem>
            </Select>
          </Box>
          <Typography variant="h5" color="primary">
            Filter by
          </Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="status-content"
              id="status-header"
            >
              <Typography variant="h5" color="primary">
                Status
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1} direction={"row"}>
                <RadioGroup
                  value={selectedStatuses}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as ExtendedListingStatus)
                  }
                  row
                >
                  <FormControlLabel
                    value={"ACTIVE"}
                    control={<Radio />}
                    label="Active"
                  />
                  <FormControlLabel
                    value={"SOLD"}
                    control={<Radio />}
                    label="Sold"
                  />
                  <FormControlLabel
                    value={"ENDED"}
                    control={<Radio />}
                    label="Ended"
                  />
                </RadioGroup>
              </Stack>
            </AccordionDetails>
          </Accordion>
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
              <Stack spacing={0}>
                {isLoading ? (
                  <Typography>Loading categories...</Typography>
                ) : categoryHierarchy ? (
                  categoryHierarchy.map((category) => (
                    <Accordion key={category.name}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="category-parent-content"
                        id="category-parent-header"
                      >
                        <Typography variant={"body1"} color="primary">
                          {category.name}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {category.children.map((childCategory) => (
                          <Grid key={childCategory.name}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedCategories.includes(
                                    childCategory.name
                                  )}
                                  onChange={() =>
                                    handleCategoryChange(childCategory.name)
                                  }
                                />
                              }
                              label={childCategory.name}
                              sx={{
                                width: "100%",
                                marginRight: 0,
                                minWidth: "10em",
                              }}
                            />
                          </Grid>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  ))
                ) : (
                  <Typography>No categories available</Typography>
                )}
              </Stack>
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
