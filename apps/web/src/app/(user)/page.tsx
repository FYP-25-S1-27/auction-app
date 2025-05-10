import { Container } from "@mui/material";
import CategoryBar from "@/libs/components/CategoryBar";
import PopularCategories from "@/libs/components/PopularCategories";
import ListingCarousel from "@/libs/components/listings/ListingCarousel";
import { getEndingSoonListings } from "@/libs/actions/db/listings/endingSoon";
import getTopListings from "@/libs/actions/db/listings/topPicks";
import getRecommendedListings from "@/libs/actions/db/listings/recommended";
import { connection } from "next/server";

export default async function LandingPage() {
  // force server side render instead of static generation
  // because we need to get the latest listings
  await connection();

  return (
    <Container sx={{ minHeight: "100vh" }}>
      <CategoryBar />
      {/* Top Picks in each category */}
      <ListingCarousel
        listings={await getTopListings()}
        title="Top picks in each collection"
      />
      <ListingCarousel
        listings={await getEndingSoonListings()}
        title="Auctions Ending Soon"
      />
      <PopularCategories />
      {/* Recommended items / You might also like */}
      <ListingCarousel
        listings={await getRecommendedListings()}
        title="You might also like"
      />
    </Container>
  );
}
