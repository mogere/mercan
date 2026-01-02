import { db } from "../../../../../db";
import { carGenerations, carModels, carMakes } from "../../../../../db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const modelId = searchParams.get("modelId");

        if (modelId) {
            const generations = await db
                .select({
                    id: carGenerations.id,
                    name: carGenerations.name,
                    yearRange: carGenerations.yearRange,
                    modelName: carModels.name,
                    modelId: carModels.id,
                    makeId: carMakes.id,
                    makeName: carMakes.name,
                })
                .from(carGenerations)
                .leftJoin(carModels, eq(carGenerations.modelId, carModels.id))
                .leftJoin(carMakes, eq(carModels.makeId, carMakes.id))
                .where(eq(carGenerations.modelId, parseInt(modelId)));

            const formatted = generations.map((g) => ({
                id: g.id,
                name: g.name,
                yearRange: g.yearRange,
                model: g.modelId ? {
                    id: g.modelId,
                    name: g.modelName,
                    make: g.makeId ? {
                        id: g.makeId,
                        name: g.makeName,
                    } : null,
                } : null,
            }));

            return NextResponse.json(formatted);
        }

        const allGenerations = await db
            .select({
                id: carGenerations.id,
                name: carGenerations.name,
                yearRange: carGenerations.yearRange,
                modelName: carModels.name,
                modelId: carModels.id,
                makeId: carMakes.id,
                makeName: carMakes.name,
            })
            .from(carGenerations)
            .leftJoin(carModels, eq(carGenerations.modelId, carModels.id))
            .leftJoin(carMakes, eq(carModels.makeId, carMakes.id));

        const formatted = allGenerations.map((g) => ({
            id: g.id,
            name: g.name,
            yearRange: g.yearRange,
            model: g.modelId ? {
                id: g.modelId,
                name: g.modelName,
                make: g.makeId ? {
                    id: g.makeId,
                    name: g.makeName,
                } : null,
            } : null,
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Error fetching car generations:", error);
        return NextResponse.json(
            { error: "Failed to fetch car generations" },
            { status: 500 }
        );
    }
}

