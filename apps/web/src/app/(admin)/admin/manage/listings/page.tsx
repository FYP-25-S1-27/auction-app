import { CustomAdminListingDataGrid } from "@/libs/components/admin/CustomAdminDataGrid";
import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import { Paper, Typography } from "@mui/material";
import { connection } from "next/server";

export default async function ManageListingsPage() {
  await connection();

  const dbListings = await db.select().from(listings);

  return (
    <div>
      <Typography variant="h4">Manage Listings</Typography>
      <Paper>
        <CustomAdminListingDataGrid listings={dbListings} />
      </Paper>
    </div>
  );
}
