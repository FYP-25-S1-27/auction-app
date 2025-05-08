"use client";

import { Container } from "@mui/material";
import CategoryBar from "@/libs/components/CategoryBar";
import EndingSoon from "@/libs/components/Endingsoon";
import PopularCategories from "@/libs/components/PopularCategories";
import { useEffect, useState } from "react";
import { TopListingsInCategory } from "../api/toppicks/route";
import ListingCarousel from "@/libs/components/listings/ListingCarousel";
import { listings } from "@/libs/db/schema";

export default function LandingPage() {
  const [topPicksListings, setTopPicksListings] =
    useState<TopListingsInCategory>([]);

  const [recommendedItems, setRecommendedItems] = useState<
    (typeof listings.$inferSelect)[]
  >([]);

  async function fetchTopPicks() {
    const response = await fetch("/api/toppicks");
    if (!response.ok) {
      throw new Error("Failed to fetch top picks");
    }
    const data = await response.json();
    setTopPicksListings(data);
  }

  async function fetchRecommendedItems() {
    try {
      const response = await fetch("/api/recommended_items");
      if (!response.ok) {
        throw new Error("Failed to fetch recommended items");
      }
      const data = await response.json();
      setRecommendedItems(data);
    } catch (error) {
      console.error("Error fetching recommended items:", error);
    }
  }

  useEffect(() => {
    fetchTopPicks().catch((error) => {
      console.error("Error fetching top picks:", error);
    });

    fetchRecommendedItems().catch((error) => {
      console.error("Error fetching recommended items:", error);
    });
  }, []);
  return (
    <Container sx={{ minHeight: "100vh" }}>
      <CategoryBar />
      {/* Top Picks in each category */}
      <ListingCarousel
        listings={topPicksListings}
        title="Top picks in each collection"
      />
      <EndingSoon />
      <PopularCategories />
      {/* Recommended items / You might also like */}
      <ListingCarousel
        listings={recommendedItems}
        title="You might also like"
      />
    </Container>
  );
}
