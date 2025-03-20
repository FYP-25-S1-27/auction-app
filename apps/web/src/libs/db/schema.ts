import {
  pgTable,
  serial,
  foreignKey,
  integer,
  text,
  numeric,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  uuid: text().primaryKey().notNull(),
  username: text().notNull().unique(),
  bio: text(),
  is_admin: boolean().default(false).notNull(),
  created_at: timestamp()
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
export const userProfile = pgTable("user_profile", {
  userUuid: text()
    .primaryKey()
    .references(() => users.uuid, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  bio: text(),
  phone: text(),
  address: text(),
  gender: text(),
  age: integer(),
  createdAt: timestamp()
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp()
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// export const listingCategory = pgTable("listing_category", {
//   name: text().primaryKey(),
// });

export const listingCategory = pgTable(
  "listing_category",
  {
    name: text().primaryKey(),
    parent: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.parent],
      foreignColumns: [table.name],
      name: "listing_category_parent_fkey",
    }).onDelete("cascade"),
  ]
);

export const listingTypes = pgEnum("listing_types", ["REQUEST", "LISTING"]);

export const listings = pgTable(
  "listings_and_requests",
  {
    id: serial().primaryKey().notNull(),
    user_uuid: text().notNull(),
    category: text().notNull(),
    name: text().notNull(),
    description: text(),
    starting_price: integer().notNull(),
    current_price: integer(),
    end_time: timestamp({ mode: "string" }).notNull(), //https://orm.drizzle.team/docs/column-types/pg#timestamp - should be a string to be predictable, do not let the ORM convert it to a Date object
    status: text().default("ACTIVE"), // ACTIVE, SOLD
    created_at: timestamp({ mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    foreignKey({
      columns: [table.user_uuid],
      foreignColumns: [users.uuid],
      name: "listings_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.category],
      foreignColumns: [listingCategory.name],
      name: "listings_category_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const listingImages = pgTable(
  "listing_images",
  {
    id: serial().primaryKey().notNull(),
    listingId: integer().notNull(),
    imageUrl: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.listingId],
      foreignColumns: [listings.id],
      name: "listing_images_listing_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const listingUserLikes = pgTable(
  "user_listing_likes",
  {
    user_uuid: text().notNull(),
    listingId: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.user_uuid],
      foreignColumns: [users.uuid],
      name: "user_listing_likes_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.listingId],
      foreignColumns: [listings.id],
      name: "user_listing_likes_listing_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const bidTypes = pgEnum("bid_types", ["OFFER", "BID"]);

export const bids = pgTable(
  "bids_and_offers",
  {
    id: serial().primaryKey().notNull(),
    listing_id: integer().notNull(),
    user_uuid: text().notNull(),
    bid_amount: integer().notNull(),
    bid_time: timestamp({ mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.listing_id],
      foreignColumns: [listings.id],
      name: "bids_listing_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.user_uuid],
      foreignColumns: [users.uuid],
      name: "bids_user_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const transactions = pgTable(
  "transactions",
  {
    id: serial().primaryKey().notNull(),
    listingId: integer().notNull(),
    buyerUuid: text().notNull(),
    sellerUuid: text().notNull(),
    salePrice: numeric({ precision: 10, scale: 2 }).notNull(),
    transactionDate: timestamp({ mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`
    ),
  },
  (table) => [
    foreignKey({
      columns: [table.listingId],
      foreignColumns: [listings.id],
      name: "transactions_listing_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.buyerUuid],
      foreignColumns: [users.uuid],
      name: "transactions_buyer_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.sellerUuid],
      foreignColumns: [users.uuid],
      name: "transactions_seller_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const wallets = pgTable(
  "wallets",
  {
    user_uuid: text().primaryKey(),
    balance: numeric({ precision: 10, scale: 2 }).default("0").notNull(),
    lastUpdated: timestamp({ mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    foreignKey({
      columns: [table.user_uuid],
      foreignColumns: [users.uuid],
      name: "wallets_user_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const user_category_interests = pgTable(
  "user_category_interests",
  {
    userUuid: text("useruuid")
      .notNull()
      .references(() => userProfile.userUuid, { onDelete: "cascade" }), 
    categoryName: text("categoryname")
      .notNull()
      .references(() => listingCategory.name, { onDelete: "cascade" }), 
  },
  (table) => [
    foreignKey({
      columns: [table.userUuid],
      foreignColumns: [userProfile.userUuid],
      name: "user_interests_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.categoryName],
      foreignColumns: [listingCategory.name],
      name: "user_interests_category_id_fkey",
    }).onDelete("cascade"),
    {
      primaryKey: [table.userUuid, table.categoryName], // Composite primary key
    },
  ]
);
