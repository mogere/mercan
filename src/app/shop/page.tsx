"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FilterDropdown from "@/components/FilterDropdown";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  inStock: boolean;
  category: { id: number; name: string } | null;
  generation: {
    id: number;
    name: string;
    yearRange: string;
    model: {
      id: number;
      name: string;
      make: { id: number; name: string } | null;
    } | null;
  } | null;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ShopPage() {
  const searchParams = useSearchParams();
  const { addItem } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(
    searchParams.get("categoryId") || ""
  );
  const [makeId, setMakeId] = useState(searchParams.get("makeId") || "");
  const [inStock, setInStock] = useState(
    searchParams.get("inStock") === "true"
  );
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [makes, setMakes] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchMakes();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, categoryId, makeId, inStock, page]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(
        data.map((cat: any) => ({
          value: cat.id.toString(),
          label: cat.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchMakes = async () => {
    try {
      const res = await fetch("/api/makes");
      const data = await res.json();
      setMakes(
        data.map((make: any) => ({
          value: make.id.toString(),
          label: make.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching makes:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "12");
      if (search) params.append("search", search);
      if (categoryId) params.append("categoryId", categoryId);
      if (makeId) params.append("makeId", makeId);
      if (inStock) params.append("inStock", "true");

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.data);
        setMeta(data.meta);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || "/placeholder.png",
      inStock: product.inStock,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryId("");
    setMakeId("");
    setInStock(false);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-600">
            Browse our collection of premium auto parts and accessories
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:col-span-1 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <Card className="p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                {(search || categoryId || makeId || inStock) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <FilterDropdown
                    placeholder="All Categories"
                    options={categories}
                    value={categoryId}
                    onChange={setCategoryId}
                    className="w-full"
                  />
                </div>

                {/* Make Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Car Make
                  </label>
                  <FilterDropdown
                    placeholder="All Makes"
                    options={makes}
                    value={makeId}
                    onChange={setMakeId}
                    className="w-full"
                  />
                </div>

                {/* In Stock Filter */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label
                    htmlFor="inStock"
                    className="ml-2 text-sm text-gray-700"
                  >
                    In Stock Only
                  </label>
                </div>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg h-96 animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-500 mb-2">No products found</p>
                <p className="text-gray-400 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Results Info */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600">
                    Showing {products.length} of {meta?.total || 0} products
                  </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <Link href={`/products/${product.id}`}>
                        <div className="relative w-full h-48 bg-gray-100">
                          <Image
                            src={product.imageUrl || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          {!product.inStock && (
                            <div className="absolute top-2 right-2">
                              <Badge variant="destructive">Out of Stock</Badge>
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="p-4">
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-semibold text-gray-900 mb-1 hover:text-orange-600 line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>

                        {product.category && (
                          <p className="text-xs text-gray-500 mb-2">
                            {product.category.name}
                          </p>
                        )}

                        {product.generation && (
                          <p className="text-xs text-gray-600 mb-3">
                            {product.generation.model?.make?.name}{" "}
                            {product.generation.model?.name}{" "}
                            {product.generation.name}
                          </p>
                        )}

                        <p className="text-xl font-bold text-gray-900 mb-4">
                          KES {product.price.toLocaleString()}
                        </p>

                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!meta.hasPrevPage}
                    >
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      Page {meta.page} of {meta.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!meta.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
