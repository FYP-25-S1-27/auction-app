import { Card, CardContent, CardMedia, Typography } from "@mui/material";

export default async function ListCard({ listing }: { listing: string }) {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={listing.image}
        alt={listing.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {listing.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {listing.price}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {listing.timeLeft}
        </Typography>
      </CardContent>
    </Card>
  );
}
