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
  resetToken: varchar("reset_token", { length: 255 }),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  reviews: many(reviews),
  cart: many(cart),
  appointments: many(appointments),
  accounts: many(accounts),
  sessions: many(sessions),
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
  shippingAddress: text("shipping_address"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"),
  mpesaTransactionId: varchar("mpesa_transaction_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

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

// --------------------------------------------------
// ORDER ITEMS (line items for each order)
// --------------------------------------------------
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id, {
    onDelete: "cascade",
  }),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(), // snapshot price at time of order
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// --------------------------------------------------
// SHOPPING CART
// --------------------------------------------------
export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  productId: integer("product_id").references(() => products.id, {
    onDelete: "cascade",
  }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cartRelations = relations(cart, ({ one }) => ({
  user: one(users, {
    fields: [cart.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cart.productId],
    references: [products.id],
  }),
}));

// --------------------------------------------------
// APPOINTMENTS (for service bookings)
// --------------------------------------------------
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  serviceId: integer("service_id").references(() => services.id, {
    onDelete: "cascade",
  }),
  appointmentDate: timestamp("appointment_date").notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const appointmentRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
}));

// --------------------------------------------------
// NEWSLETTER
// --------------------------------------------------
export const newsletter = pgTable("newsletter", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 150 }).unique().notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
});

// --------------------------------------------------
// AUTH.JS TABLES (NextAuth v5)
// --------------------------------------------------
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
});

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const verificationTokens = pgTable("verification_tokens", {
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expires: timestamp("expires").notNull(),
});
