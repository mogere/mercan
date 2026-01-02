"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, Calendar } from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  durationMins: number | null;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/service");
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Professional car care services delivered by experienced technicians.
            Book your appointment today and keep your vehicle in top condition.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No services available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="flex flex-col hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  {service.imageUrl && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={service.imageUrl}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardTitle className="text-2xl">{service.name}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {service.description ||
                      "Professional service for your vehicle"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-4 h-4 mr-2 text-orange-600" />
                      <span>
                        {service.durationMins
                          ? `${service.durationMins} minutes`
                          : "Duration varies"}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      KES {service.price?.toLocaleString() || "N/A"}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/services/${service.id}/book`}
                    className="w-full"
                  >
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose Our Services?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Technicians</h3>
              <p className="text-gray-600">
                Certified professionals with years of experience
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quick Service</h3>
              <p className="text-gray-600">
                Fast turnaround without compromising quality
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">
                We stand behind our work with warranties
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
