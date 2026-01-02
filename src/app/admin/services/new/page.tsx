"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function NewServicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    durationMins: "",
    imageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseInt(formData.price),
          durationMins: formData.durationMins ? parseInt(formData.durationMins) : null,
          imageUrl: formData.imageUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Service created successfully!");
        router.push("/admin/services");
      } else {
        toast.error(data.error || "Failed to create service");
      }
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <Link
          href="/admin/services"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Services
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Service</h1>
        <p className="text-gray-600">Create a new service offering</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Oil Change"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Service description..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (KES) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0"
                  required
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationMins">Duration (minutes)</Label>
                <Input
                  id="durationMins"
                  type="number"
                  value={formData.durationMins}
                  onChange={(e) =>
                    setFormData({ ...formData, durationMins: e.target.value })
                  }
                  placeholder="e.g., 60"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL *</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                required
              />
              <p className="text-sm text-gray-500">
                Enter a direct link to the service image
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Service"
                )}
              </Button>
              <Link href="/admin/services">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
