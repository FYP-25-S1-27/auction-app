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
  isAdmin: boolean().default(false).notNull(),
  createdAt: timestamp()
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
    userUuid: text().notNull(),
    category: text().notNull(),
    name: text().notNull(),
    description: text(),
    startingPrice: integer().notNull(),
    currentPrice: integer(),
    type: listingTypes("listing_types").notNull().default("LISTING"), // LISTING, REQUEST
    endTime: timestamp({ mode: "string" }).notNull(), //https://orm.drizzle.team/docs/column-types/pg#timestamp - should be a string to be predictable, do not let the ORM convert it to a Date object
    status: text().default("ACTIVE"), // ACTIVE, SOLD
    createdAt: timestamp({ mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    foreignKey({
      columns: [table.userUuid],
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
    userUuid: text().notNull(),
    listingId: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userUuid],
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
    listingId: integer().notNull(),
    userUuid: text().notNull(),
    bidAmount: integer().notNull(),
    bidTime: timestamp({ mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    type: bidTypes("bid_types").notNull().default("BID"), // OFFER, BID
  },
  (table) => [
    foreignKey({
      columns: [table.listingId],
      foreignColumns: [listings.id],
      name: "bids_listing_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userUuid],
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
    userUuid: text().primaryKey(),
    balance: numeric({ precision: 10, scale: 2 }).default("0").notNull(),
    lastUpdated: timestamp({ mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    foreignKey({
      columns: [table.userUuid],
      foreignColumns: [users.uuid],
      name: "wallets_user_id_fkey",
    }).onDelete("cascade"),
  ]
);
