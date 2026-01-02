"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, ArrowLeft, Check, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  inStock: boolean;
  createdAt: string;
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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();

      if (data.success) {
        setProduct(data.data);
      } else {
        router.push("/shop");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      router.push("/shop");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      // id: product.id.toString(),
      productId: product.id,
      name: product.name,
      price: product.price,
      // quantity,
      imageUrl: product.imageUrl || "/placeholder.png",
      inStock: product.inStock,
    });

    alert(`Added ${quantity} item(s) to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="aspect-square bg-gray-300 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            href="/shop"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <Image
                src={product.imageUrl || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {!product.inStock && (
                <div className="absolute top-4 right-4">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-6">
                {product.category && (
                  <p className="text-sm text-orange-600 font-medium mb-2">
                    {product.category.name}
                  </p>
                )}
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {product.generation && (
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Badge variant="outline" className="text-sm">
                      {product.generation.model?.make?.name}{" "}
                      {product.generation.model?.name} {product.generation.name}
                    </Badge>
                    {product.generation.yearRange && (
                      <span className="text-sm">
                        ({product.generation.yearRange})
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-8">
                <p className="text-4xl font-bold text-gray-900">
                  KES {product.price.toLocaleString()}
                </p>
              </div>

              {/* Stock Status */}
              <Card className="p-4 mb-6">
                <div className="flex items-center gap-2">
                  {product.inStock ? (
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-green-600 font-medium">
                        In Stock
                      </span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-red-600" />
                      <span className="text-red-600 font-medium">
                        Out of Stock
                      </span>
                    </>
                  )}
                </div>
              </Card>

              {/* Description */}
              {product.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Quantity Selector */}
              {product.inStock && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-medium w-16 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-lg py-6"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>

              {/* Additional Info */}
              <Card className="p-6 mt-8">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Product Information
                </h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Product ID</dt>
                    <dd className="font-medium text-gray-900">#{product.id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Availability</dt>
                    <dd className="font-medium text-gray-900">
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </dd>
                  </div>
                  {product.category && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Category</dt>
                      <dd className="font-medium text-gray-900">
                        {product.category.name}
                      </dd>
                    </div>
                  )}
                </dl>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
