import { reset } from "drizzle-seed";
import { db } from "./drizzle";
import * as schema from "./schema";
import { ManagementApiError } from "auth0";
import { faker } from "@faker-js/faker";
import { seedCategoriesListingsAndImages } from "./helper/categories_listing_and_images";
import { seedBids } from "./helper/bids";
import { seedTransactions } from "./helper/transactions";
import { seedUserLikes } from "./helper/listing_user_likes";
import { seedUserInterests } from "./helper/user_category_interests";
import { seedWallets } from "./helper/wallet";
import { getAuth0ManagementClient } from "../actions/auth0-management";

const USER_COUNT = 50;
const ADMIN_COUNT = 5;
const PASSWORD = "1Qwer$#@!";
faker.seed(321);

const auth0management = getAuth0ManagementClient();

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
  const usersOnly = args.includes("--users-only");
  console.log("Skip users:", skipUsers);

  if (!skipUsers) {
    console.log(`Creating test users on Auth0 with password="${PASSWORD}" ...`);
    for (let i = 1; i <= USER_COUNT; i++) {
      await seedAuth0Users(`test.user${i}@test.test`, PASSWORD); // not using Promise.all here as it will hit the rate limit
    }
    for (let i = 1; i <= ADMIN_COUNT; i++) {
      await seedAuth0Users(`test.admin${i}@test.test`, PASSWORD);
    }
  }

  const auth0users = (await auth0management.users.getAll()).data || [];

  if (usersOnly) {
    return 0; // Skip seeding other tables
  }

  console.log("Reseting database...");
  await reset(db, schema);

  // Seed users
  console.log("Seeding auth0 users to database along with profile...");
  await Promise.all(
    auth0users.map(async (user) => {
      await db.insert(schema.users).values({
        uuid: user.user_id,
        username: `${user.nickname}.${faker.number.int({
          min: 0,
          max: 9,
        })}${faker.number.int({ min: 0, max: 9 })}`,
        isAdmin: /admin/.test(user.email) ? true : false, // Set admin status based on email using regex
        createdAt: new Date(user.created_at.toString()),
      });
      await db.insert(schema.userProfile).values({
        userUuid: user.user_id,
        bio: faker.person.bio(),
        phone: faker.phone.number({ style: "international" }),
        address: faker.location.streetAddress(),
        gender: faker.helpers.arrayElement(["MALE", "FEMALE"]),
        age: faker.number.int({ min: 18, max: 70 }),
        createdAt: new Date(user.created_at.toString()),
      });
    })
  );

  const _userIds = auth0users.map((user) => user.user_id);
  // remove admins from userIds - admins should not have any listings, bids, transactions or likes
  const _userIdsWithoutAdmins = _userIds.filter(
    (userId) =>
      !auth0users
        .find((user) => user.user_id === userId)
        ?.email?.includes("admin")
  );

  console.log("Seeding categories, accompanying listings and images...");
  const { allListings } = await seedCategoriesListingsAndImages(
    _userIdsWithoutAdmins
  );

  const listingIds = allListings.map((listing) => listing.id);

  await Promise.all([
    console.log("Seeding bids..."),
    seedBids(allListings, _userIdsWithoutAdmins),

    console.log("Seeding transactions..."),
    seedTransactions(listingIds, _userIdsWithoutAdmins),

    console.log("Seeding listing user likes..."),
    seedUserLikes(listingIds, _userIdsWithoutAdmins),

    console.log("Seeding user category interests..."),
    seedUserInterests(_userIdsWithoutAdmins),

    console.log("Seeding wallets..."),
    seedWallets(_userIdsWithoutAdmins),
  ]);
  return 0;
}

main().catch((error) => {
  console.error("Error during seeding:", error);
  process.exit(1);
});
