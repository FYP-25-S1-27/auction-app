import { Container } from "@mui/material";
import CategoryBar from "@/libs/components/CategoryBar";
import PopularCategories from "@/libs/components/PopularCategories";
import ListingCarousel from "@/libs/components/listings/ListingCarousel";
import { getEndingSoonListings } from "@/libs/actions/db/listings/endingSoon";
import getTopListings from "@/libs/actions/db/listings/topPicks";
import getRecommendedListings from "@/libs/actions/db/listings/recommended";
import getRecentSoldTransaction from "@/libs/actions/db/listings/recentSold";
import { connection } from "next/server";
import { auth0 } from "@/libs/auth0";
import { getUserInterests } from "@/libs/actions/db/userCategoryInterests";

export default async function LandingPage() {
  // force server side render instead of static generation
  // because we need to get the latest listings
  await connection();

  const user = await auth0.getSession();
  let userInterests: Awaited<ReturnType<typeof getUserInterests>> | null = null;
  if (user) {
    userInterests = await getUserInterests(user.user.sub);
  } // Fetch recommended listings with fallback
  const recommendedListings = await getRecommendedListings(
    userInterests
      ? userInterests.map((i) => ({ categoryName: i.categoryName }))
      : undefined
  );

  // Determine the appropriate title based on whether we got recommendations
  // from user interests or had to fall back to random listings
  const recommendedTitle =
    userInterests?.length &&
    recommendedListings.some((listing) =>
      userInterests.some(
        (interest) => interest.categoryName === listing.category
      )
    )
      ? "Recommended for you"
      : "You might also like";

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
        listings={recommendedListings}
        title={recommendedTitle}
      />
      {/* Recently sold transactions */}
      <ListingCarousel
        listings={await getRecentSoldTransaction()}
        title="Recent Auction Sold Transactions"
      />
    </Container>
  );
}
