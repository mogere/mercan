import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Search, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mb-6">
            <h1 className="text-9xl font-bold text-orange-600">404</h1>
          </div>
          <CardTitle className="text-3xl">Page Not Found</CardTitle>
          <CardDescription className="text-lg">
            Sorry, we couldn't find the page you're looking for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Link href="/" className="block">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <Home className="w-6 h-6" />
                <span>Home</span>
              </Button>
            </Link>
            <Link href="/shop" className="block">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                <span>Shop</span>
              </Button>
            </Link>
            <Link href="/services" className="block">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                <Search className="w-6 h-6" />
                <span>Services</span>
              </Button>
            </Link>
          </div>
          <Link href="/" className="block">
            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              Return to Homepage
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
