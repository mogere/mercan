"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "./Button";
import ProductCard from "./ProductCard";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  inStock: boolean;
}

const NewProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchNewProducts();
  }, []);

  const fetchNewProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=4&page=1");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.slice(0, 4));
      }
    } catch (error) {
      console.error("Error fetching new products:", error);
    }
  };

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage("Successfully subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription failed");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong");
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 3000);
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-10 h-fit p-6 bg-[#3A3A3C]">
        <div className="flex justify-between">
          <div>
            <h1 className="text-orange-500 font-extrabold mb-2 text-2xl md:text-5xl">
              New Products
            </h1>
            <span>
              Fresh arrivals built for performance, style, and reliability.
            </span>
          </div>
          <div>
            <Link href="/shop">
              <Button label="Learn More" iconUrl="/browse.svg" underline />
            </Link>
          </div>
        </div>

        <div className="projects grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                imageUrl={product.imageUrl || "/product.png"}
                title={product.name}
                description={product.description || ""}
                price={product.price}
                inStock={product.inStock}
              />
            ))
          ) : (
            // Placeholder cards while loading
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96" />
            ))
          )}
        </div>
      </div>
      <div className="bg-[#3A3A3C] grid grid-cols-1 md:grid-cols-2">
        <Image
          src="/gear.png"
          alt="Product"
          width={650}
          height={500}
          className=""
        />
        <div className="mt-8 max-w-xl px-6 md:px-0">
          <h1 className="text-orange-500 text-3xl md:text-5xl mb-8 font-bold">
            Stay Ahead with the Latest Auto Gear
          </h1>
          <span className="text-lg md:text-xl">
            Subscribe to our newsletter and be the first to know when new
            products drop — from premium spares to performance upgrades. Get
            exclusive deals, tips, and updates straight to your inbox.
          </span>
          <p></p>
          <div className="flex gap-2 mt-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
              className="border border-gray-300 flex-1 md:flex-none md:w-1/2 p-2 bg-white text-gray-500"
              disabled={status === "loading"}
            />
            <button
              onClick={handleSubscribe}
              disabled={status === "loading"}
              className="bg-orange-500 text-white px-4 py-2 hover:bg-orange-600 transition disabled:opacity-50"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </div>
          {message && (
            <p className={`text-sm mt-2 ${status === "success" ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProducts;
