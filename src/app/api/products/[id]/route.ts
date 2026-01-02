import { NextRequest } from "next/server";
import { db } from "@/../db";
import {
  products,
  categories,
  carGenerations,
  carModels,
  carMakes,
} from "@/../db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch single product by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return errorResponse("Invalid product ID", 400);
    }

    const [product] = await db
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
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      inStock: product.inStock,
      createdAt: product.createdAt,
      category: product.categoryId
        ? {
            id: product.categoryId,
            name: product.categoryName,
          }
        : null,
      generation: product.genId
        ? {
            id: product.genId,
            name: product.genName,
            yearRange: product.genYearRange,
            model: product.modelId
              ? {
                  id: product.modelId,
                  name: product.modelName,
                  make: product.makeId
                    ? {
                        id: product.makeId,
                        name: product.makeName,
                      }
                    : null,
                }
              : null,
          }
        : null,
    };

    return successResponse(formattedProduct);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH - Update product (Admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "admin") {
      return errorResponse("Unauthorized - Admin access required", 401);
    }

    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return errorResponse("Invalid product ID", 400);
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

    // Validation
    if (price !== undefined && (typeof price !== "number" || price < 0)) {
      return errorResponse("Invalid price", 400);
    }

    // Build update object (only include provided fields)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (inStock !== undefined) updateData.inStock = inStock;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (carGenerationId !== undefined)
      updateData.carGenerationId = carGenerationId;

    if (Object.keys(updateData).length === 0) {
      return errorResponse("No fields to update", 400);
    }

    // Update product
    const [updatedProduct] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, productId))
      .returning();

    if (!updatedProduct) {
      return errorResponse("Product not found", 404);
    }

    return successResponse(updatedProduct);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE - Delete product (Admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "admin") {
      return errorResponse("Unauthorized - Admin access required", 401);
    }

    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return errorResponse("Invalid product ID", 400);
    }

    // Delete product
    const [deletedProduct] = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning();

    if (!deletedProduct) {
      return errorResponse("Product not found", 404);
    }

    return successResponse({ message: "Product deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
