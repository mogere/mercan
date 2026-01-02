"use client";

import { useState } from "react";
import { Menu, X, Home, ShoppingBag, Wrench, Car, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const menuItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/shop", label: "Shop", icon: ShoppingBag },
    { href: "/services", label: "Services", icon: Wrench },
    { href: "/sales", label: "Car Sales", icon: Car },
  ];

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 hover:bg-gray-100 rounded-md transition"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMenu}
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button
                  onClick={closeMenu}
                  className="p-2 hover:bg-gray-100 rounded-md transition"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {/* User Info Section */}
              {session ? (
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {session.user?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="block w-full text-center py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition mb-2"
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      closeMenu();
                    }}
                    className="block w-full text-center py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                  <Link
                    href="/auth/login"
                    onClick={closeMenu}
                    className="block w-full text-center py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition mb-2"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={closeMenu}
                    className="block w-full text-center py-2 px-4 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition"
                  >
                    Create Account
                  </Link>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="p-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700"
                        >
                          <Icon className="w-5 h-5 text-orange-500" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Additional Links */}
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 px-4">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/about"
                      onClick={closeMenu}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      onClick={closeMenu}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cart"
                      onClick={closeMenu}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      Shopping Cart
                    </Link>
                  </li>
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
