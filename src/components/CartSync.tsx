"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";

export default function CartSync() {
  const { data: session, status } = useSession();
  const syncToDatabase = useCartStore((state) => state.syncToDatabase);
  const loadFromDatabase = useCartStore((state) => state.loadFromDatabase);
  const hasSynced = useRef(false);

  useEffect(() => {
    // Only run when session status changes
    if (status === "loading") return;

    if (session && !hasSynced.current) {
      // User is logged in - sync localStorage to database, then load from database
      const syncCart = async () => {
        await syncToDatabase();
        await loadFromDatabase();
        hasSynced.current = true;
      };
      syncCart();
    } else if (!session) {
      // User logged out - reset sync flag
      hasSynced.current = false;
    }
  }, [session, status, syncToDatabase, loadFromDatabase]);

  // This component doesn't render anything
  return null;
}
