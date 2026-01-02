import { db } from "../../../../db";
import { services } from "../../../../db/schema";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const [data, totalResult] = await Promise.all([
      db.select().from(services).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(services),
    ]);

    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, price, durationMins, imageUrl } =
      await request.json();

    if (!name || !price || !imageUrl) {
      return NextResponse.json(
        { error: "Service name, price, and image URL are required" },
        { status: 400 }
      );
    }

    const [newService] = await db
      .insert(services)
      .values({
        name,
        description,
        price,
        durationMins,
        imageUrl,
      })
      .returning();

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
