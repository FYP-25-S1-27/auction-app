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
  primaryKey,
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
    startTime: timestamp({ mode: "string" }), // ADDED THIS
    status: text().default("ACTIVE"), // ACTIVE, SOLD
    createdAt: timestamp({ mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
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
    listingId: integer().notNull().unique(),
    buyerUuid: text().notNull(),
    sellerUuid: text().notNull(),
    salePrice: integer().notNull(),
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
    balance: integer().default(0).notNull(),
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
    primaryKey({ columns: [table.userUuid, table.categoryName] }),
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
  ]
);

export const requests = pgTable("requests", {
  id: serial().primaryKey().notNull(),
  title: text().notNull(),
  description: text(),
  category: text().notNull(),
  userUuid: text().notNull(),
  createdAt: timestamp({ mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const offers = pgTable(
  "offers",
  {
    id: serial().primaryKey().notNull(),
    requestId: integer().notNull(),
    userUuid: text().notNull(),
    offerAmount: numeric().notNull(),
    offerTime: timestamp({ mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userUuid],
      foreignColumns: [users.uuid],
      name: "offers_user_uuid_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.requestId],
      foreignColumns: [requests.id],
      name: "offers_request_id_fkey",
    }).onDelete("cascade"),
  ]
);
