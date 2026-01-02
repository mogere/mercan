import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/../db";
import { orders, products, appointments, users } from "@/../db/schema";
import { count, sum, eq, gte } from "drizzle-orm";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

// GET - Admin statistics
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "admin") {
      return errorResponse("Unauthorized - Admin access required", 403);
    }

    // Get total revenue
    const [{ totalRevenue }] = await db
      .select({ totalRevenue: sum(orders.totalAmount) })
      .from(orders)
      .where(eq(orders.status, "delivered"));

    // Get total orders count
    const [{ totalOrders }] = await db
      .select({ totalOrders: count() })
      .from(orders);

    // Get pending orders count
    const [{ pendingOrders }] = await db
      .select({ pendingOrders: count() })
      .from(orders)
      .where(eq(orders.status, "pending"));

    // Get total products count
    const [{ totalProducts }] = await db
      .select({ totalProducts: count() })
      .from(products);

    // Get low stock products count (inStock = false)
    const [{ lowStockProducts }] = await db
      .select({ lowStockProducts: count() })
      .from(products)
      .where(eq(products.inStock, false));

    // Get upcoming appointments count
    const now = new Date();
    const [{ upcomingAppointments }] = await db
      .select({ upcomingAppointments: count() })
      .from(appointments)
      .where(gte(appointments.appointmentDate, now));

    // Get total customers count
    const [{ totalCustomers }] = await db
      .select({ totalCustomers: count() })
      .from(users);

    return successResponse({
      totalRevenue: Number(totalRevenue) || 0,
      totalOrders: Number(totalOrders) || 0,
      pendingOrders: Number(pendingOrders) || 0,
      totalProducts: Number(totalProducts) || 0,
      lowStockProducts: Number(lowStockProducts) || 0,
      upcomingAppointments: Number(upcomingAppointments) || 0,
      totalCustomers: Number(totalCustomers) || 0,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
