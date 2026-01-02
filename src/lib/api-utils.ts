import { NextResponse } from "next/server";

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export function getPaginationParams(
  searchParams: URLSearchParams
): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "12"))
  );
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function successResponse<T>(
  data: T,
  status: number = 200,
  meta?: Record<string, any>
) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta && { meta }),
    },
    { status }
  );
}

export function errorResponse(
  message: string,
  status: number = 400,
  errors?: Record<string, any>
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(errors && { errors }),
    },
    { status }
  );
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }

  return errorResponse("An unexpected error occurred", 500);
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
