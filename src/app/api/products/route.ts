import { db } from "@/../db";
import { products, categories, carGenerations, carModels, carMakes } from "@/../db/schema";
// import { NextResponse } from "next/server";
import { eq, or, like, and, sql, count } from "drizzle-orm";
import { auth } from "@/lib/auth";
import {
    getPaginationParams,
    successResponse,
    errorResponse,
    handleApiError,
    createPaginationMeta,
} from "@/lib/api-utils";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const { page, limit, offset } = getPaginationParams(searchParams);

        const makeId = searchParams.get("makeId");
        const modelId = searchParams.get("modelId");
        const generationId = searchParams.get("generationId");
        const categoryId = searchParams.get("categoryId");
        const search = searchParams.get("search");
        const inStock = searchParams.get("inStock");

        const conditions = [];

        if (generationId) {
            conditions.push(eq(products.carGenerationId, parseInt(generationId)));
        }

        if (categoryId) {
            conditions.push(eq(products.categoryId, parseInt(categoryId)));
        }

        if (inStock === "true") {
            conditions.push(eq(products.inStock, true));
        }

        if (search) {
            conditions.push(
                or(
                    like(products.name, `%${search}%`),
                    like(products.description, `%${search}%`)
                )!
            );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [{ total }] = await db
            .select({ total: count() })
            .from(products)
            .where(whereClause);

        const productsList = await db
            .select({
                id: products.id,
                name: products.name,
                description: products.description,
                price: products.price,
                imageUrl: products.imageUrl,
                inStock: products.inStock,
                createdAt: products.createdAt,
                categoryId: categories.id,
                categoryName: categories.name,
                genId: carGenerations.id,
                genName: carGenerations.name,
                genYearRange: carGenerations.yearRange,
                modelId: carModels.id,
                modelName: carModels.name,
                makeId: carMakes.id,
                makeName: carMakes.name,
            })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .leftJoin(
                carGenerations,
                eq(products.carGenerationId, carGenerations.id)
            )
            .leftJoin(carModels, eq(carGenerations.modelId, carModels.id))
            .leftJoin(carMakes, eq(carModels.makeId, carMakes.id))
            .where(whereClause)
            .limit(limit)
            .offset(offset)
            .orderBy(products.createdAt);

        const formattedProducts = productsList.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            imageUrl: p.imageUrl,
            inStock: p.inStock,
            createdAt: p.createdAt,
            category: p.categoryId
                ? {
                    id: p.categoryId,
                    name: p.categoryName,
                }
                : null,
            generation: p.genId
                ? {
                    id: p.genId,
                    name: p.genName,
                    yearRange: p.genYearRange,
                    model: p.modelId
                        ? {
                            id: p.modelId,
                            name: p.modelName,
                            make: p.makeId
                                ? {
                                    id: p.makeId,
                                    name: p.makeName,
                                }
                                : null,
                        }
                        : null,
                }
                : null,
        }));

        const paginationMeta = createPaginationMeta(page, limit, Number(total));

        return successResponse(formattedProducts, 200, paginationMeta);
    } catch (error) {
        return handleApiError(error);
    }
}

// POST - Create new product (Admin only)
export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session || !session.user || session.user.role !== "admin") {
            return errorResponse("Unauthorized - Admin access required", 401);
        }

        const body = await request.json();
        const {
            name,
            description,
            price,
            imageUrl,
            inStock,
            categoryId,
            carGenerationId,
        } = body;

        if (!name || !price) {
            return errorResponse("Name and price are required", 400);
        }

        if (typeof price !== "number" || price < 0) {
            return errorResponse("Invalid price", 400);
        }

        const [newProduct] = await db
            .insert(products)
            .values({
                name,
                description: description || null,
                price,
                imageUrl: imageUrl || null,
                inStock: inStock !== undefined ? inStock : true,
                categoryId: categoryId || null,
                carGenerationId: carGenerationId || null,
            })
            .returning();

        return successResponse(newProduct, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
