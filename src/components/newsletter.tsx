"use client";

import type React from "react";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h3 className="text-sm font-semibold text-center sm:text-left">
            Subscribe To Get Information About New Arrivals And Offers
          </h3>
          <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="Enter Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-3 py-2 rounded text-gray-800 text-sm flex-1 sm:flex-none"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
