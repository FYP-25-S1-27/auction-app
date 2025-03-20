import { getListingLeftJoinUser } from "@/libs/actions/db/listings";
import ListingCard from "@/libs/components/listings/ListingCard";
import { Container, Grid2 } from "@mui/material";
import { connection } from "next/server";

export default async function SearchPage() {
  await connection();
  const allListings = await getListingLeftJoinUser();
  return (
    <Container>
      <Grid2 container spacing={4}>
        {allListings.map((listing, i) => {
          return <ListingCard listing={listing} key={i} />;
        })}
      </Grid2>
    </Container>
  );
}
