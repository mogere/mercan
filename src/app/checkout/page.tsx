import CheckoutForm from "@/components/checkout-form";
import Newsletter from "@/components/newsletter";
import OrderSummary from "@/components/order-summary";

export const metadata = {
  title: "Checkout",
  description: "Complete your order",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>

        {/* Return to Cart */}
        <div className="mt-12 mb-8">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Return to cart
          </a>
        </div>
      </main>

      <Newsletter />
    </div>
  );
}
