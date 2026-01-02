import { drizzle } from "drizzle-orm/node-postgres";
// import { eq } from "drizzle-orm";
import * as schema from "./schema";
import { config } from "dotenv";
import pg from "pg";
import bcrypt from "bcryptjs";

config({ path: ".env" }); // ensure DATABASE_URL is loaded

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log("🌱 Starting database seed...");

  // 0️⃣ Users
  const passwordHash = await bcrypt.hash("password123", 10);
  const users = await db
    .insert(schema.users)
    .values([
      {
        name: "Admin User",
        email: "admin@mercan.com",
        passwordHash,
        role: "admin",
      },
      {
        name: "John Doe",
        email: "john@example.com",
        passwordHash,
        role: "customer",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        passwordHash,
        role: "customer",
      },
    ])
    .returning();

  console.log(`✅ Inserted ${users.length} users`);

  // 1️⃣ Car Makes
  const makes = await db
    .insert(schema.carMakes)
    .values([
      { name: "Mercedes Benz", logoUrl: "/logos/mercedes.png" },
      { name: "BMW", logoUrl: "/logos/bmw.png" },
      { name: "Audi", logoUrl: "/logos/audi.png" },
      { name: "Porsche", logoUrl: "/logos/porsche.png" },
      { name: "Toyota", logoUrl: "/logos/toyota.png" },
      { name: "Honda", logoUrl: "/logos/honda.png" },
      { name: "Subaru", logoUrl: "/logos/subaru.png" },
      { name: "Volkswagen", logoUrl: "/logos/vw.png" },
    ])
    .returning();

  console.log(`✅ Inserted ${makes.length} car makes`);

  // 2️⃣ Models
  const mercedesId = makes.find((m) => m.name === "Mercedes Benz")?.id;
  const bmwId = makes.find((m) => m.name === "BMW")?.id;
  const audiId = makes.find((m) => m.name === "Audi")?.id;
  const toyotaId = makes.find((m) => m.name === "Toyota")?.id;
  const subaruId = makes.find((m) => m.name === "Subaru")?.id;

  const models = await db
    .insert(schema.carModels)
    .values([
      { makeId: mercedesId!, name: "C Class" },
      { makeId: mercedesId!, name: "E Class" },
      { makeId: bmwId!, name: "3 Series" },
      { makeId: bmwId!, name: "5 Series" },
      { makeId: bmwId!, name: "M3" },
      { makeId: audiId!, name: "A4" },
      { makeId: audiId!, name: "RS6" },
      { makeId: toyotaId!, name: "Land Cruiser" },
      { makeId: toyotaId!, name: "Prado" },
      { makeId: subaruId!, name: "WRX STI" },
    ])
    .returning();

  console.log(`✅ Inserted ${models.length} models`);

  // 3️⃣ Generations
  const cClassId = models.find((m) => m.name === "C Class")?.id;
  const eClassId = models.find((m) => m.name === "E Class")?.id;
  const m3Id = models.find((m) => m.name === "M3")?.id;
  const pradoId = models.find((m) => m.name === "Prado")?.id;
  const wrxId = models.find((m) => m.name === "WRX STI")?.id;

  const generations = await db
    .insert(schema.carGenerations)
    .values([
      { modelId: cClassId!, name: "W206", yearRange: "2022-Up" },
      { modelId: cClassId!, name: "W205", yearRange: "2015-2021" },
      { modelId: eClassId!, name: "W213", yearRange: "2016-2023" },
      { modelId: m3Id!, name: "G80", yearRange: "2021-Up" },
      { modelId: m3Id!, name: "F80", yearRange: "2014-2018" },
      { modelId: pradoId!, name: "J150", yearRange: "2009-2021" },
      { modelId: wrxId!, name: "VA", yearRange: "2015-2021" },
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
      { name: "Interior", description: "Seats, trim, accessories" },
      { name: "Wheels & Tires", description: "Alloy wheels, tires, spacers" },
      { name: "Exhaust Systems", description: "Cat-back, downpipes, tips" },
      { name: "Brakes", description: "Brake pads, rotors, calipers" },
    ])
    .returning();

  console.log(`✅ Inserted ${categories.length} categories`);

  // 5️⃣ Products
  const bodyKitCat = categories.find((c) => c.name === "Body Kits")?.id;
  const lightingCat = categories.find((c) => c.name === "Lighting")?.id;
  const performanceCat = categories.find((c) => c.name === "Performance")?.id;
  const wheelsCat = categories.find((c) => c.name === "Wheels & Tires")?.id;
  const exhaustCat = categories.find((c) => c.name === "Exhaust Systems")?.id;
  const brakesCat = categories.find((c) => c.name === "Brakes")?.id;

  const cClassW205 = generations.find((g) => g.name === "W205")?.id;
  const m3F80 = generations.find((g) => g.name === "F80")?.id;
  const pradoJ150 = generations.find((g) => g.name === "J150")?.id;
  const wrxVA = generations.find((g) => g.name === "VA")?.id;

  await db.insert(schema.products).values([
    // Mercedes C-Class W205
    {
      name: "C-Class W205 AMG Line Body Kit",
      description:
        "Full AMG line body kit with front & rear bumpers, side skirts, and diffuser.",
      price: 120000,
      imageUrl: "/beamer.png",
      categoryId: bodyKitCat,
      carGenerationId: cClassW205,
      inStock: true,
    },
    {
      name: "C-Class W205 LED Headlights",
      description: "OEM-style LED headlights for Mercedes-Benz C-Class W205.",
      price: 75000,
      imageUrl: "/mercedes.png",
      categoryId: lightingCat,
      carGenerationId: cClassW205,
      inStock: true,
    },
    {
      name: "C-Class W205 Performance Exhaust",
      description: "Cat-back exhaust system with valves for aggressive sound.",
      price: 95000,
      imageUrl: "/lcruiser.png",
      categoryId: exhaustCat,
      carGenerationId: cClassW205,
      inStock: true,
    },

    // BMW M3 F80
    {
      name: "M3 F80 Carbon Fiber Front Lip",
      description: "High-quality carbon fiber front lip spoiler.",
      price: 45000,
      imageUrl: "/beamer.png",
      categoryId: bodyKitCat,
      carGenerationId: m3F80,
      inStock: true,
    },
    {
      name: "M3 F80 Competition Wheels 19\"",
      description: "OEM Competition wheels with staggered fitment.",
      price: 180000,
      imageUrl: "/mercedes.png",
      categoryId: wheelsCat,
      carGenerationId: m3F80,
      inStock: true,
    },
    {
      name: "M3 F80 Big Brake Kit",
      description: "6-piston front brake kit with 380mm rotors.",
      price: 250000,
      imageUrl: "/lcruiser.png",
      categoryId: brakesCat,
      carGenerationId: m3F80,
      inStock: false,
    },

    // Toyota Prado
    {
      name: "Prado 150 TRD Body Kit",
      description: "TRD-style body kit for rugged off-road look.",
      price: 85000,
      imageUrl: "/beamer.png",
      categoryId: bodyKitCat,
      carGenerationId: pradoJ150,
      inStock: true,
    },
    {
      name: "Prado 150 LED Light Bar",
      description: "50-inch LED light bar for off-road adventures.",
      price: 35000,
      imageUrl: "/mercedes.png",
      categoryId: lightingCat,
      carGenerationId: pradoJ150,
      inStock: true,
    },
    {
      name: "Prado 150 Lift Kit 2\"",
      description: "Suspension lift kit for improved ground clearance.",
      price: 65000,
      imageUrl: "/lcruiser.png",
      categoryId: performanceCat,
      carGenerationId: pradoJ150,
      inStock: true,
    },

    // Subaru WRX STI
    {
      name: "WRX STI VA Carbon Fiber Hood",
      description: "Lightweight carbon fiber hood with vents.",
      price: 110000,
      imageUrl: "/beamer.png",
      categoryId: bodyKitCat,
      carGenerationId: wrxVA,
      inStock: true,
    },
    {
      name: "WRX STI VA Stage 2 Turbo",
      description: "Upgraded turbocharger for 400+ HP.",
      price: 280000,
      imageUrl: "/mercedes.png",
      categoryId: performanceCat,
      carGenerationId: wrxVA,
      inStock: false,
    },
    {
      name: "WRX STI VA Coilovers",
      description: "Adjustable coilover suspension system.",
      price: 120000,
      imageUrl: "/lcruiser.png",
      categoryId: performanceCat,
      carGenerationId: wrxVA,
      inStock: true,
    },

    // Generic products
    {
      name: "Universal LED DRL Strips",
      description: "Flexible LED daytime running light strips.",
      price: 8000,
      imageUrl: "/beamer.png",
      categoryId: lightingCat,
      carGenerationId: null,
      inStock: true,
    },
    {
      name: "Performance Air Filter",
      description: "High-flow air filter for improved performance.",
      price: 12000,
      imageUrl: "/mercedes.png",
      categoryId: performanceCat,
      carGenerationId: null,
      inStock: true,
    },
    {
      name: "Carbon Fiber Mirror Caps",
      description: "Universal carbon fiber side mirror covers.",
      price: 15000,
      imageUrl: "/lcruiser.png",
      categoryId: bodyKitCat,
      carGenerationId: null,
      inStock: true,
    },
  ]);

  console.log(`✅ Inserted 15 sample products`);

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
