"use client";
import ListingCard from "@/libs/components/listings/ListingCard";
import FilterCard from "@/libs/components/search/FilterCard";
import { Box, Grid2, Pagination, Stack } from "@mui/material";
import * as qs from "qs";
import { listings } from "@/libs/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useEffect, useState } from "react";

type GetListings = {
  items: InferSelectModel<typeof listings>[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

export default function SearchPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listings, setListings] = useState<GetListings | null>(null);
  useEffect(() => {
    // Fetch categories when component mounts
    const queryString = window.location.search.substring(1);
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${window.location.origin}/api/listings?${queryString}`
        );
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);
  // get listings.items highest price
  const maxPrice = listings
    ? Math.max(
        ...listings.items.map((listing) => {
          return listing.currentPrice || listing.startingPrice;
        })
      )
    : undefined;
  // get listings.items lowest price
  const minPrice = listings
    ? Math.min(
        ...listings.items.map((listing) => {
          return listing.currentPrice || listing.startingPrice;
        })
      )
    : undefined;

  console.log(maxPrice, minPrice);
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    // Get existing search params - remove the leading ? character
    const searchString = window.location.search.substring(1);
    const existingParams = qs.parse(searchString);

    // Merge existing params with new filter values
    const newParams = {
      ...existingParams,
      page: value.toString(),
      // Add category when ready
      // category: selectedCategories.join(","),
    };

    // Generate the query string
    const queryString = qs.stringify(newParams);

    window.location.search = queryString;
  };

  return (
    <Box sx={{ marginY: "4rem", marginX: "5rem" }}>
      <Stack direction="row" spacing={4}>
        <div>
          <FilterCard
            initialFilters={{
              maxPrice: maxPrice,
              minPrice: minPrice,
            }}
          />
        </div>
        <div>
          <Grid2 container spacing={4}>
            {listings
              ? listings.items.map((listing, i) => {
                  return <ListingCard listing={listing} key={i} />;
                })
              : null}
          </Grid2>
        </div>
      </Stack>
      <Box
        justifyContent={"center"}
        width={"100%"}
        display={"flex"}
        marginTop={"2rem"}
      >
        <Pagination
          color="primary"
          count={listings?.pagination.totalPages}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
}
