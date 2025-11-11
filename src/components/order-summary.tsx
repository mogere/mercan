"use client";

export default function OrderSummary() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit sticky top-4">
      <h2 className="text-lg text-black font-semibold mb-6">Order Summary</h2>

      {/* Product Card */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex gap-4 mb-4">
          {/* Product Image */}
          <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0">
            {/* Replace with your product image */}
            <img
              src="/car-part-splitter.jpg"
              alt="Product"
              className="w-full h-full object-cover rounded"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-orange-500 mb-1">
              Audi Q3 Central Rear Splitter
            </h3>
            <p className="text-xs text-gray-600 line-clamp-3">
              Premium Audi Q3 central rear splitter. Enhance the style of your
              vehicle with this exclusive aftermarket splitter.
            </p>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-orange-500 font-semibold">Ksh 60,000</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery</span>
          <span className="text-orange-500 font-semibold">Ksh 1,200</span>
        </div>
        <div className="flex justify-between text-black text-base font-bold pt-3 border-t border-gray-200">
          <span>Estimated Total</span>
          <span className="text-orange-500">Ksh 61,200</span>
        </div>
      </div>

      {/* Place Order Button */}
      <button className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-3 rounded transition-colors">
        Place Order
      </button>
    </div>
  );
}
