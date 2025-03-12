import {
  pgTable,
  serial,
  varchar,
  foreignKey,
  integer,
  text,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  uuid: text().primaryKey().notNull(),
  username: text().notNull(),
  role: text().default("user"),
});

export const listings = pgTable(
  "listings",
  {
    id: serial().primaryKey().notNull(),
    userUuid: text("user_uuid").notNull(),
    title: text().notNull(),
    description: text(),
    startPrice: numeric("start_price", { precision: 10, scale: 2 }).notNull(),
    currentPrice: numeric("current_price", { precision: 10, scale: 2 }).default(
      "0"
    ),
    status: varchar({ length: 20 }).default("active"),
    endTime: timestamp("end_time", { mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userUuid],
      foreignColumns: [users.uuid],
      name: "listings_user_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const bids = pgTable(
  "bids",
  {
    id: serial().primaryKey().notNull(),
    listingId: integer("listing_id").notNull(),
    userUuid: text("user_uuid").notNull(),
    bidAmount: numeric("bid_amount", { precision: 10, scale: 2 }).notNull(),
    bidTime: timestamp("bid_time", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`
    ),
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
    listingId: integer("listing_id").notNull(),
    buyerUuid: text("buyer_uuid").notNull(),
    sellerUuid: text("seller_uuid").notNull(),
    salePrice: numeric("sale_price", { precision: 10, scale: 2 }).notNull(),
    transactionDate: timestamp("transaction_date", { mode: "string" }).default(
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
    id: serial().primaryKey().notNull(),
    userUuid: text("user_uuid").notNull(),
    balance: numeric({ precision: 10, scale: 2 }).default("0").notNull(),
    lastUpdated: timestamp("last_updated", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`
    ),
  },
  (table) => [
    foreignKey({
      columns: [table.userUuid],
      foreignColumns: [users.uuid],
      name: "wallets_user_id_fkey",
    }).onDelete("cascade"),
  ]
);
