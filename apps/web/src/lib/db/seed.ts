import { reset, seed } from "drizzle-seed";
import { db } from "./drizzle";
import * as schema from "./schema";

async function main() {
  console.log("Reseting database...");
  await reset(db, schema);
  console.log("Seeding database...");
  await seed(db, schema, { seed: 314, count: 50 }).refine((f) => ({
    users: {
      columns: {
        is_admin: f.default({
          defaultValue: false,
        }),
        bio: f.loremIpsum({ sentencesCount: 1 }),
        created_at: f.default({
          defaultValue: new Date(),
        }),
      },
      count: 20,
    },
    listing_category: {
      columns: {
        name: f.valuesFromArray({
          values: ["Electronics", "Clothing", "Furniture", "Books"],
        }),
      },
    },
    listings: {
      columns: {
        status: f.valuesFromArray({ values: ["active", "sold"] }),
        startPrice: f.int({ minValue: 100, maxValue: 99999 }),
        currentPrice: f.int({ minValue: 100, maxValue: 99999 }),
      },
    },
    listing_images: {
      columns: {
        imageUrl: f.default({
          defaultValue: "/list_img/image_placeholder.jpg",
        }),
      },
    },
  }));

  return 0;
}

main();
