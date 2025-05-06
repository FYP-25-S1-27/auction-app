import { CustomAdminCategoryDataGrid } from "@/libs/components/admin/CustomAdminDataGrid";
import { db } from "@/libs/db/drizzle";
import { listingCategory } from "@/libs/db/schema";
import { Paper, Typography } from "@mui/material";
import { connection } from "next/server";

export default async function ManageCategoriesPage() {
  await connection();

  const dbCategory = await db.select().from(listingCategory);

  return (
    <div>
      <Typography variant="h4">Manage Categories</Typography>
      <Paper>
        <CustomAdminCategoryDataGrid listingCategory={dbCategory} />
      </Paper>
    </div>
  );
}