import { drizzle } from "drizzle-orm/node-postgres";
// import { eq } from "drizzle-orm";
import * as schema from "./schema";
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env" }); // ensure DATABASE_URL is loaded

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log("🌱 Starting database seed...");

  // 1️⃣ Car Makes
  const makes = await db
    .insert(schema.carMakes)
    .values([
      { name: "Mercedes Benz", logoUrl: "/logos/mercedes.png" },
      { name: "BMW", logoUrl: "/logos/bmw.png" },
      { name: "Audi", logoUrl: "/logos/audi.png" },
      { name: "Porsche", logoUrl: "/logos/porsche.png" },
    ])
    .returning();

  console.log(`✅ Inserted ${makes.length} car makes`);

  // 2️⃣ Models
  const mercedesId = makes.find((m) => m.name === "Mercedes Benz")?.id;
  const bmwId = makes.find((m) => m.name === "BMW")?.id;

  const models = await db
    .insert(schema.carModels)
    .values([
      { makeId: mercedesId!, name: "C Class" },
      { makeId: mercedesId!, name: "E Class" },
      { makeId: bmwId!, name: "3 Series" },
      { makeId: bmwId!, name: "5 Series" },
    ])
    .returning();

  console.log(`✅ Inserted ${models.length} models`);

  // 3️⃣ Generations
  const cClassId = models.find((m) => m.name === "C Class")?.id;
  const eClassId = models.find((m) => m.name === "E Class")?.id;

  const generations = await db
    .insert(schema.carGenerations)
    .values([
      { modelId: cClassId!, name: "W206", yearRange: "2022-Up" },
      { modelId: cClassId!, name: "W205", yearRange: "2015-2021" },
      { modelId: eClassId!, name: "W213", yearRange: "2016-2023" },
    ])
    .returning();

  console.log(`✅ Inserted ${generations.length} generations`);

  // 4️⃣ Categories
  const categories = await db
    .insert(schema.categories)
    .values([
      { name: "Body Kits", description: "Exterior styling parts" },
      { name: "Lighting", description: "Headlights, tail lights, DRLs" },
      { name: "Performance", description: "Engine, exhaust, suspension" },
    ])
    .returning();

  console.log(`✅ Inserted ${categories.length} categories`);

  // 5️⃣ Products
  const bodyKitCat = categories.find((c) => c.name === "Body Kits")?.id;
  const lightingCat = categories.find((c) => c.name === "Lighting")?.id;

  const cClassW205 = generations.find((g) => g.name === "W205")?.id;

  await db.insert(schema.products).values([
    {
      name: "C-Class W205 AMG Line Body Kit",
      description:
        "Full AMG line body kit with front & rear bumpers, side skirts, and diffuser.",
      price: 120000,
      imageUrl: "/products/w205_bodykit.jpg",
      categoryId: bodyKitCat,
      carGenerationId: cClassW205,
    },
    {
      name: "C-Class W205 LED Headlights",
      description: "OEM-style LED headlights for Mercedes-Benz C-Class W205.",
      price: 75000,
      imageUrl: "/products/w205_headlights.jpg",
      categoryId: lightingCat,
      carGenerationId: cClassW205,
    },
  ]);

  console.log(`✅ Inserted sample products`);

  // 6️⃣ Services
  await db.insert(schema.services).values([
    {
      name: "Full Vehicle Service",
      description:
        "Comprehensive maintenance including oil change, filters, and inspection.",
      price: 15000,
      durationMins: 90,
      imageUrl: "/services/full_service.jpg",
    },
    {
      name: "Detailing & Polishing",
      description: "Interior and exterior detailing for showroom shine.",
      price: 8000,
      durationMins: 120,
      imageUrl: "/services/detailing.jpg",
    },
  ]);

  console.log(`✅ Inserted sample services`);

  console.log("🌿 Seeding complete!");
  await pool.end();
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  pool.end();
});
