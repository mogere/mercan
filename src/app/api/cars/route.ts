import { db } from "../../../../db";
import {
  carMakes,
  carModels,
  products,
  categories,
} from "../../../../db/schema";
import { eq } from "drizzle-orm";

import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const data = await db.select().from(carMakes);
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Error fetching car makes:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch car makes" },
//       { status: 500 }
//     );
//   }
// }
export async function GET() {
  try {
    // Step 1: fetch makes with their models
    const makes = await db
      .select({
        make_id: carMakes.id,
        make_name: carMakes.name,
        make_logo: carMakes.logoUrl,
        model_id: carModels.id,
        model_name: carModels.name,
        category: categories.name,
        product_name: products.name,
        product_price: products.price,
      })
      .from(carMakes)
      .leftJoin(carModels, eq(carModels.makeId, carMakes.id))
      .leftJoin(products, eq(products.categoryId, carModels.id))
      .leftJoin(categories, eq(categories.id, products.categoryId));

    // Step 2: group them into a hierarchical structure
    const grouped = makes.reduce((acc: any, row) => {
      let make = acc.find((m: any) => m.id === row.make_id);
      if (!make) {
        make = {
          id: row.make_id,
          name: row.make_name,
          logo: row.make_logo,
          models: [],
        };
        acc.push(make);
      }

      if (row.model_id) {
        let model = make.models.find((mo: any) => mo.id === row.model_id);
        if (!model) {
          model = {
            id: row.model_id,
            name: row.model_name,
            products: [],
          };
          make.models.push(model);
        }

        if (row.product_name) {
          model.products.push({
            name: row.product_name,
            category: row.category,
            price: row.product_price,
          });
        }
      }

      return acc;
    }, []);

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("Error fetching car data:", error);
    return NextResponse.json(
      { error: "Failed to fetch car data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, logoUrl } = await request.json();

    if (!name || !logoUrl) {
      return NextResponse.json(
        { error: "Car make name and logo URL are required" },
        { status: 400 }
      );
    }
    const [newCarMake] = await db
      .insert(carMakes)
      .values({ name, logoUrl })
      .returning();

    return NextResponse.json(newCarMake, { status: 201 });
  } catch (error) {
    console.error("Error creating car make:", error);
    return NextResponse.json(
      { error: "Failed to create car make" },
      { status: 500 }
    );
  }
}
