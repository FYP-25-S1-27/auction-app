"use server";

import { db } from "@/libs/db/drizzle";
import { listingCategory } from "@/libs/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function getListingCategories() {
  const categories = await db.select().from(listingCategory);
  return categories;
}

export async function deleteCategory({
  mainCategory,
  subCategory,
}: {
  mainCategory: string | null;
  subCategory: string;
}) {
  const condition =
    mainCategory === null
      ? and(isNull(listingCategory.parent), eq(listingCategory.name, subCategory))
      : and(eq(listingCategory.parent, mainCategory), eq(listingCategory.name, subCategory));

  await db.delete(listingCategory).where(condition);
}

export async function createCategory(formData: FormData): Promise<{ message: string; success: boolean; }> {
  const mainCategory = formData.get("mainCategory") as string | null;
  const subCategory = formData.get("subCategory") as string | null;

  if (!subCategory) {
    return { success: false, message: "Subcategory is required." };
  }

  // Prevent duplicates
  const condition =
    mainCategory === null
      ? and(isNull(listingCategory.parent), eq(listingCategory.name, subCategory))
      : and(eq(listingCategory.parent, mainCategory), eq(listingCategory.name, subCategory));

  const existing = await db.select().from(listingCategory).where(condition);

  if (existing.length > 0) {
    return {
      success: false,
      message: "This subcategory already exists under the selected main category.",
    };
  }

  await db.insert(listingCategory).values({
    name: subCategory,
    parent: mainCategory,
  });

  return { success: true, message: "A new category created successfully!" };
}