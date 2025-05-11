import { Typography } from "@mui/material";
import { db } from "@/libs/db/drizzle";
import { isNull } from "drizzle-orm";
import { CreateCategoryForm } from "@/libs/components/admin/CreateCategoryForm";
import { listingCategory } from "@/libs/db/schema";
import { connection } from "next/server";

export default async function CreateCategoryPage() {
  await connection();
  const mainCategories = await db
    .select()
    .from(listingCategory)
    .where(isNull(listingCategory.parent));

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Create New Category
      </Typography>
      <CreateCategoryForm listingCategory={mainCategories} />
    </div>
  );
}
