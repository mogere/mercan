import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
  //   pgEnum,
  //   jsonb,
  //   primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --------------------------------------------------
// USERS
// --------------------------------------------------
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }),
  role: varchar("role", { length: 50 }).default("customer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  reviews: many(reviews),
}));

// --------------------------------------------------
// CAR HIERARCHY
// --------------------------------------------------

// Car Makes (e.g., Mercedes Benz)
export const carMakes = pgTable("car_makes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  logoUrl: text("logo_url"), // car brand logo URL
  createdAt: timestamp("created_at").defaultNow(),
});

// Car Models (e.g., C Class, S Class)
export const carModels = pgTable("car_models", {
  id: serial("id").primaryKey(),
  makeId: integer("make_id").references(() => carMakes.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Car Generations (e.g., W205, W204)
export const carGenerations = pgTable("car_generations", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").references(() => carModels.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 100 }).notNull(),
  yearRange: varchar("year_range", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Car Relationships
export const carMakeRelations = relations(carMakes, ({ many }) => ({
  models: many(carModels),
}));

export const carModelRelations = relations(carModels, ({ one, many }) => ({
  make: one(carMakes, {
    fields: [carModels.makeId],
    references: [carMakes.id],
  }),
  generations: many(carGenerations),
}));

export const carGenerationRelations = relations(
  carGenerations,
  ({ one, many }) => ({
    model: one(carModels, {
      fields: [carGenerations.modelId],
      references: [carModels.id],
    }),
    products: many(products),
  })
);

// --------------------------------------------------
// PRODUCT CATEGORIES
// --------------------------------------------------
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// --------------------------------------------------
// PRODUCTS (Spares, Bodykits, Lighting, etc.)
// --------------------------------------------------
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  imageUrl: text("image_url"),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  carGenerationId: integer("car_generation_id").references(
    () => carGenerations.id,
    { onDelete: "set null" }
  ),
  createdAt: timestamp("created_at").defaultNow(),
  inStock: boolean("in_stock").default(true),
});

export const productRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  generation: one(carGenerations, {
    fields: [products.carGenerationId],
    references: [carGenerations.id],
  }),
}));

// --------------------------------------------------
// SERVICES (e.g., Car Wash, Bodywork, Tune-Up)
// --------------------------------------------------
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  price: integer("price"),
  imageUrl: text("image_url"),
  durationMins: integer("duration_mins"), // optional
  createdAt: timestamp("created_at").defaultNow(),
});

// --------------------------------------------------
// ORDERS (for products or services)
// --------------------------------------------------
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  totalAmount: integer("total_amount").notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// --------------------------------------------------
// REVIEWS (for products or services)
// --------------------------------------------------
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  productId: integer("product_id").references(() => products.id, {
    onDelete: "cascade",
  }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});
