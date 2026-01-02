"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, ChevronDown, LogOut } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import MobileNav from "./MobileNav";

const Header = ({ showHeader }: { showHeader: boolean }) => {
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session, status } = useSession();
  const { totalItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/shop");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header
      className="w-full text-black flex items-center justify-between px-6 py-3 shadow-sm relative"
      style={{
        backgroundImage: "linear-gradient(to right, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95)), url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1920')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/logo.png"
          alt="Mercan Auto Spares"
          width={60}
          height={60}
          className="object-contain"
        />
      </Link>

      <nav className="hidden md:flex items-center space-x-6">
        <Link
          href="/shop"
          className="text-sm font-medium hover:text-[#e3703b] transition"
        >
          Shop
        </Link>
        <Link
          href="/services"
          className="text-sm font-medium hover:text-[#e3703b] transition"
        >
          Book Service
        </Link>
      </nav>

      <div className="flex-1 max-w-2xl mx-6 hidden md:flex">
        <div className="flex w-full border border-gray-300 rounded-lg overflow-hidden">
          <div className="flex items-center px-3 bg-gray-100 border-r border-gray-300 cursor-pointer">
            <span className="font-semibold text-sm">{category}</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </div>
          <input
            type="text"
            placeholder="I am Looking for…."
            className="flex-1 px-4 py-2 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="bg-[#e3703b] text-white font-semibold px-5 hover:bg-[#cf602c] transition"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center">
          {status === "loading" ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : session ? (
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard"
                className="flex items-center text-sm font-medium hover:text-[#e3703b] transition"
              >
                <User className="w-5 h-5 mr-1" />
                {session.user?.name}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center text-sm text-gray-600 hover:text-red-600 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center text-sm font-medium hover:text-[#e3703b] transition"
            >
              <User className="w-5 h-5 mr-1" />
              Login
            </Link>
          )}
        </div>

        <Link
          href="/cart"
          className="relative cursor-pointer hover:text-[#e3703b] transition"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>

        <MobileNav />
      </div>
    </header>
  );
};

export default Header;
