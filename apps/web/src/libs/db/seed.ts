import { reset, seed } from "drizzle-seed";
import { db } from "./drizzle";
import * as schema from "./schema";
import { auth0management } from "../actions/auth0-management";
import { ManagementApiError } from "auth0";
import { faker } from "@faker-js/faker";

const COUNT = 50;
faker.seed(321);

async function seedAuth0Users(email: string, password: string) {
  try {
    await auth0management.users.create({
      email,
      password,
      connection: "Username-Password-Authentication",
    });
    return 0;
  } catch (error) {
    if (error instanceof ManagementApiError) {
      if (error.error == "Conflict") {
        console.log(`${email} already exists`);
        return 1;
      }
    }
  }
}

async function main() {
  console.log("Reseting database...");
  await reset(db, schema);

  const PASSWORD = "1Qwer#@!";
  console.log(`Creating test users on Auth0 with password="${PASSWORD}" ...`);
  for (let i = 0; i < 5; i++) {
    await seedAuth0Users(`test${i}.user@test.test`, PASSWORD);
  }
  await seedAuth0Users(`test.admin@test.test`, PASSWORD);
  const auth0users = (await auth0management.users.getAll()).data || [];

  // Seed users
  console.log("Seeding auth0 users to database...");
  await Promise.all(
    auth0users.map(async (user) => {
      await db.insert(schema.users).values({
        uuid: user.user_id,
        username: user.nickname,
        bio: faker.person.bio(),
        isAdmin: /admin/.test(user.email) ? true : false, // Set admin status based on email using regex
        createdAt: new Date(user.created_at.toString()),
      });
    })
  );

  const categories = [
    "Gadgets",
    "Books",
    "Clothing",
    "Furniture",
    "Jewelry",
    "Watches",
    "Art",
    "Alcohol",
    "Cars",
  ];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { users, ...schemaFiltered } = schema; // Remove users table from schema
  // Seed remaining tables
  console.log("Seeding remaining tables...");
  await seed(db, schemaFiltered, { count: COUNT, seed: 321 }).refine((f) => ({
    wallets: {
      columns: {
        userUuid: f.valuesFromArray({
          values: auth0users.map((user) => user.user_id),
          isUnique: true,
        }),
        balance: f.int({ minValue: 0, maxValue: 1000 }),
        lastUpdated: f.valuesFromArray({
          values: Array.from({ length: COUNT }, () =>
            faker.date.recent({ days: 10 }).toISOString()
          ),
        }),
      },
      count: auth0users.length,
    },
    listing_category: {
      columns: {
        name: f.valuesFromArray({
          values: categories,
          isUnique: true,
        }),
      },
      count: categories.length,
    },
    listings: {
      columns: {
        userUuid: f.valuesFromArray({
          values: auth0users.map((user) => user.user_id),
        }),
        name: f.valuesFromArray({
          values: Array.from({ length: COUNT }, () =>
            faker.commerce.productName()
          ), // Generate random product names
        }),
        description: f.loremIpsum({ sentencesCount: 1 }),
        startingPrice: f.int({ minValue: 1, maxValue: 1000 }),
        currentPrice: f.int({ minValue: 1000, maxValue: 10000 }),
        status: f.valuesFromArray({ values: ["ACTIVE", "SOLD"] }),
        endTime: f.valuesFromArray({
          values: Array.from({ length: COUNT }, () =>
            faker.date.future().toISOString()
          ),
        }),
        createdAt: f.valuesFromArray({
          values: Array.from({ length: COUNT }, () =>
            faker.date.past().toISOString()
          ),
        }),
      },
      with: {
        listing_images: 1,
      },
    },
    listing_images: {
      columns: {
        imageUrl: f.default({
          defaultValue: "/list_img/image_placeholder.jpg",
        }),
      },
    },
    listing_user_likes: {
      columns: {
        userUuid: f.valuesFromArray({
          values: auth0users.map((user) => user.user_id),
        }),
      },
    },
    bids: {
      columns: {
        userUuid: f.valuesFromArray({
          values: auth0users.map((user) => user.user_id),
        }),
        bidAmount: f.int({ minValue: 1, maxValue: 1000 }),
        createdAt: f.valuesFromArray({
          values: Array.from({ length: COUNT }, () =>
            faker.date.recent({ days: 2 }).toISOString()
          ),
        }),
      },
    },
    transactions: {
      columns: {
        buyerUuid: f.valuesFromArray({
          values: auth0users.map((user) => user.user_id),
        }),
        sellerUuid: f.valuesFromArray({
          values: auth0users.map((user) => user.user_id),
        }),
      },
    },
  }));

  // Seed listing images
  // process.stdout.write("Seeding listing images...");
  // const listings = await db.select().from(schema.listings);
  // for (const listing of listings) {
  //   await db.insert(schema.listing_images).values({
  //     listingId: listing.id,
  //     imageUrl: "/list_img/image_placeholder.jpg",
  //   });
  // }

  return 0;
}

main().catch((error) => {
  console.error("Error during seeding:", error);
  process.exit(1);
});
