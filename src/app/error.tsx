"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-16 h-16 text-red-600" />
          </div>
          <CardTitle className="text-center text-2xl">Something went wrong!</CardTitle>
          <CardDescription className="text-center">
            We're sorry, but an error occurred while processing your request.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-700 font-mono">
              {error.message || "An unexpected error occurred"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={reset}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="flex-1"
            >
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
