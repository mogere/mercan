"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Loader2,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle,
} from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  durationMins: number | null;
}

interface TimeSlot {
  time: string;
  available: boolean;
  displayTime: string;
}

export default function BookServicePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=/services/${params.id}/book`);
    }
  }, [status, router, params.id]);

  useEffect(() => {
    fetchService();
  }, [params.id]);

  useEffect(() => {
    if (selectedDate && service) {
      fetchTimeSlots();
    }
  }, [selectedDate, service]);

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/service`);
      const data = await res.json();
      const foundService = data.find(
        (s: Service) => s.id === parseInt(params.id as string)
      );

      if (foundService) {
        setService(foundService);
      } else {
        router.push("/services");
      }
    } catch (error) {
      console.error("Error fetching service:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSlots = async () => {
    if (!selectedDate || !service) return;

    setLoadingSlots(true);
    setSelectedTime("");

    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const res = await fetch(
        `/api/appointments/timeslots?date=${dateStr}&serviceId=${service.id}`
      );
      const data = await res.json();

      if (data.success) {
        setTimeSlots(data.data.slots);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedTime || !service) return;

    setBooking(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          appointmentDate: selectedTime,
          notes,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/appointments");
        }, 2000);
      } else {
        alert(data.error || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("An error occurred while booking. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!service) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-4">
              Your appointment has been successfully booked. Redirecting to your
              dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Details */}
          <div className="lg:col-span-1">
            <Card>
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
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 mr-2 text-orange-600" />
                    <span>
                      {service.durationMins
                        ? `${service.durationMins} minutes`
                        : "Duration varies"}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    KES {service.price?.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Book Your Appointment</CardTitle>
                <CardDescription>
                  Select a date and time that works best for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    <CalendarIcon className="w-4 h-4 inline mr-2" />
                    Select Date
                  </Label>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      className="rounded-md border"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Select Time
                    </Label>
                    {loadingSlots ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={
                              selectedTime === slot.time ? "default" : "outline"
                            }
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`${
                              selectedTime === slot.time
                                ? "bg-orange-600 hover:bg-orange-700"
                                : ""
                            } ${
                              !slot.available
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {slot.displayTime}
                          </Button>
                        ))}
                      </div>
                    )}
                    {timeSlots.length === 0 && !loadingSlots && (
                      <p className="text-center text-gray-500 py-4">
                        No available time slots for this date
                      </p>
                    )}
                  </div>
                )}

                {/* Notes */}
                {selectedTime && (
                  <div>
                    <Label
                      htmlFor="notes"
                      className="text-base font-semibold mb-2 block"
                    >
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any specific requirements or information we should know..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                    />
                  </div>
                )}

                {/* Booking Summary */}
                {selectedTime && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h3 className="font-semibold mb-2">Booking Summary</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Service:</span>{" "}
                        {service.name}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {selectedDate?.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p>
                        <span className="font-medium">Time:</span>{" "}
                        {
                          timeSlots.find((s) => s.time === selectedTime)
                            ?.displayTime
                        }
                      </p>
                      <p>
                        <span className="font-medium">Duration:</span>{" "}
                        {service.durationMins} minutes
                      </p>
                      <p className="text-lg font-bold text-orange-600 pt-2">
                        Total: KES {service.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBooking}
                    disabled={!selectedTime || booking}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    {booking ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
