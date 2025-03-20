import { Card, CardContent, CardMedia, Typography } from "@mui/material";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ListingCard({ listing }: { listing: any }) {
  const endDateLocale = new Date(listing.listings.endTime).toLocaleString();

  return (
    <Card sx={{ maxWidth: 240 }}>
      <CardMedia
        component="img"
        image={"/images/placeholder.png"}
        alt={listing.listings.name}
      />
      <CardContent>
        <Typography gutterBottom variant="body1" component="div">
          {listing.listings.name}
        </Typography>
        <Typography variant="subtitle1">${listing.currentPrice}</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          ${listing.listings.startingPrice}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {endDateLocale}
        </Typography>
        <Typography variant="subtitle1">{listing.users.username}</Typography>
      </CardContent>
    </Card>
  );
}
