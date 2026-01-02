import { db } from "../../../../../db";
import { carModels, carMakes } from "../../../../../db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const makeId = searchParams.get("makeId");

        if (makeId) {
            const models = await db
                .select({
                    id: carModels.id,
                    name: carModels.name,
                    makeId: carMakes.id,
                    makeName: carMakes.name,
                })
                .from(carModels)
                .leftJoin(carMakes, eq(carModels.makeId, carMakes.id))
                .where(eq(carModels.makeId, parseInt(makeId)));

            const formatted = models.map((m) => ({
                id: m.id,
                name: m.name,
                make: {
                    id: m.makeId,
                    name: m.makeName,
                },
            }));

            return NextResponse.json(formatted);
        }

        const allModels = await db
            .select({
                id: carModels.id,
                name: carModels.name,
                makeId: carMakes.id,
                makeName: carMakes.name,
            })
            .from(carModels)
            .leftJoin(carMakes, eq(carModels.makeId, carMakes.id));

        const formatted = allModels.map((m) => ({
            id: m.id,
            name: m.name,
            make: {
                id: m.makeId,
                name: m.makeName,
            },
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Error fetching car models:", error);
        return NextResponse.json(
            { error: "Failed to fetch car models" },
            { status: 500 }
        );
    }
}

