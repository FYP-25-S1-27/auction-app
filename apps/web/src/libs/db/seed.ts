import { reset, seed } from "drizzle-seed";
import { db } from "./drizzle";
import * as schema from "./schema";
import { auth0management } from "../actions/auth0-management";
import { ManagementApiError } from "auth0";
import { faker } from "@faker-js/faker";
import { seedCategoriesListingsAndImages } from "./helper/categories_listing_and_images";
import { seedBids } from "./helper/bids";
import { seedTransactions } from "./helper/transactions";
import { seedUserLikes } from "./helper/listing_user_likes";
import { seedUserInterests } from "./helper/user_category_interests";

const COUNT = 50;
const USER_COUNT = 50;
const PASSWORD = "1Qwer#@!";
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
      if (error.error === "Conflict") {
        console.log(`${email} already exists, resetting password...`);
        // Fetch the existing user details
        const existingUser = await auth0management.usersByEmail.getByEmail({
          email,
        });
        if (existingUser?.data?.[0]?.user_id) {
          await auth0management.users.update(
            { id: existingUser?.data?.[0]?.user_id },
            { password }
          );
        } else {
          throw new Error("User ID is undefined, cannot update password.");
        }
        return 1;
      }
    }
    throw error; // Re-throw other errors
  }
}

async function main() {
  const args = process.argv.slice(2);
  const skipUsers = args.includes("--skip-users");
  console.log("Skip users:", skipUsers);
  console.log("Reseting database...");
  await reset(db, schema);

  if (!skipUsers) {
    console.log(`Creating test users on Auth0 with password="${PASSWORD}" ...`);
    for (let i = 0; i < USER_COUNT; i++) {
      await seedAuth0Users(`test${i}.user@test.test`, PASSWORD); // not using Promise.all here as it will hit the rate limit
    }
    await seedAuth0Users(`test.admin@test.test`, PASSWORD);
  }

  const auth0users = (await auth0management.users.getAll()).data || [];

  // Seed users
  console.log("Seeding auth0 users to database...");
  await Promise.all(
    auth0users.map(async (user) => {
      await db.insert(schema.users).values({
        uuid: user.user_id,
        username: `${user.nickname}.${faker.number.int({ min: 1, max: 9 })}`,
        isAdmin: /admin/.test(user.email) ? true : false, // Set admin status based on email using regex
        createdAt: new Date(user.created_at.toString()),
      });
    })
  );

  const _userIds = auth0users.map((user) => user.user_id);
  console.log("Seeding categories, accompanying listings and images...");
  const { listingIds } = await seedCategoriesListingsAndImages(_userIds);
  console.log("Seeding bids...");
  await seedBids(listingIds, _userIds);
  console.log("Seeding transactions...");
  await seedTransactions(listingIds, _userIds);
  console.log("Seeding listing user likes...");
  await seedUserLikes(listingIds, _userIds);

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    users, // handled above
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    listingCategory, // handled by helper/categories_listing_and_images
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    listings, // handled by helper/categories_listing_and_images
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    listingImages, // handled by helper/categories_listing_and_images
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    listingUserLikes, // handled by helper/listing_user_likes
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bids, // handled by helper/bids
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transactions, // handled by helper/transactions
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    user_category_interests, // handled by helper/user_category_interests
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    offers, // wip
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    requests, // wip
    ...schemaFiltered
  } = schema; // Remove tables from schemas
  // Seed remaining tables
  console.log("Seeding remaining tables (except user interests)...");
  await seed(db, schemaFiltered, { count: COUNT, seed: 321 }).refine((f) => ({
    userProfile: {
      count: auth0users.length,
      columns: {
        userUuid: f.valuesFromArray({
          values: auth0users.map((user) => user.user_id),
          isUnique: true,
        }),
        gender: f.valuesFromArray({ values: ["MALE", "FEMALE"] }),
        age: f.int({ minValue: 18, maxValue: 90 }),
        bio: f.valuesFromArray({
          values: Array.from({ length: auth0users.length }, () =>
            faker.person.bio()
          ),
        }),
        phone: f.valuesFromArray({
          values: Array.from({ length: auth0users.length }, () =>
            faker.phone.number()
          ),
        }),
        address: f.valuesFromArray({
          values: Array.from({ length: auth0users.length }, () =>
            faker.location.streetAddress()
          ),
        }),
        createdAt: f.valuesFromArray({
          values: Array.from(
            { length: auth0users.length },
            () => faker.date.past() as unknown as string // surpasses type safety, only use for seeding as we know it is a date
          ),
        }),
        updatedAt: f.valuesFromArray({
          values: Array.from(
            { length: auth0users.length },
            () => faker.date.recent({ days: 90 }) as unknown as string // surpasses type safety, only use for seeding as we know it is a date
          ),
        }),
      },
    },
    wallets: {
      count: auth0users.length,
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
    },
  }));

  console.log("Seeding user category interests..."); // placed here as it relies on profiles being created first
  await seedUserInterests(_userIds);
  return 0;
}

main().catch((error) => {
  console.error("Error during seeding:", error);
  process.exit(1);
});
