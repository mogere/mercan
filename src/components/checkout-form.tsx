"use client";

import type React from "react";

import { useState } from "react";

export default function CheckoutForm() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    country: "Kenya",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "Nairobi",
    zipCode: "",
    phone: "",
    shippingOption: "delivery",
    paymentMethod: "mpesa",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="space-y-8">
      {/* Contact Information */}
      <section>
        <h2 className="text-2xl font-bold text-orange-500 mb-4">Checkout</h2>
        <div className="bg-gray-50 p-4 rounded mb-6">
          <h3 className="text-lg text-black font-semibold mb-2">
            Contact Information
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            We will use this email to send you updates about your order
          </p>
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
      </section>

      {/* Billing and Shipping Address */}
      <section>
        <div className="bg-gray-50 p-4 rounded mb-6">
          <h3 className="text-lg text-black font-semibold mb-4">
            Billing and Shipping Address
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Enter the billing and shipping address
          </p>

          <div className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded text-sm"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>

            {/* Company Name */}
            <input
              type="text"
              name="company"
              placeholder="Company Name (Optional)"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />

            {/* Country Row */}
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
            >
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
            </select>

            {/* Street Address */}
            <input
              type="text"
              name="streetAddress"
              placeholder="Street Address"
              value={formData.streetAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />

            {/* Apartment */}
            <input
              type="text"
              name="apartment"
              placeholder="* Apartment/Suite/Unit"
              value={formData.apartment}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />

            {/* City and State Row */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="city"
                placeholder="Town/City"
                value={formData.city}
                onChange={handleChange}
                className="px-3 py-2 border text-gray-800 border-gray-300 rounded text-sm"
              />
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded text-sm bg-white"
              >
                <option value="Nairobi">Nairobi</option>
                <option value="Mombasa">Mombasa</option>
                <option value="Kisumu">Kisumu</option>
              </select>
            </div>

            {/* Zip and Phone Row */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="zipCode"
                placeholder="Postcode/Zip"
                value={formData.zipCode}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded text-sm"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Options */}
      <section>
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-lg font-semibold text-black mb-4">
            Shipping Options
          </h3>
          <label className="flex items-center gap-3 p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-100">
            <input
              type="radio"
              name="shippingOption"
              value="delivery"
              checked={formData.shippingOption === "delivery"}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="flex-1 text-sm">Delivery Within Nairobi</span>
            <span className="text-sm font-semibold">Ksh 1200</span>
          </label>
        </div>
      </section>

      {/* Payment Options */}
      <section>
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">Payment Options</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-100">
              <input
                type="radio"
                name="paymentMethod"
                value="mpesa"
                checked={formData.paymentMethod === "mpesa"}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Mpesa - PayPill</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-100">
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={formData.paymentMethod === "bank"}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Bank Transfer</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-100">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={formData.paymentMethod === "paypal"}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">PayPal</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            By proceeding with your purchase you agree to our terms and
            conditions.
          </p>
        </div>
      </section>
    </form>
  );
}
