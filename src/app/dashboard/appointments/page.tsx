"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock, FileText, X, CalendarClock } from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Appointment {
  id: number;
  appointmentDate: string;
  status: string;
  notes: string | null;
  createdAt: string;
  service: {
    id: number;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    durationMins: number | null;
  };
}

export default function AppointmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/dashboard/appointments");
    } else if (status === "authenticated") {
      fetchAppointments();
    }
  }, [status, router]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();

      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!cancellingId) return;

    try {
      const res = await fetch(`/api/appointments/${cancellingId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        // Refresh appointments
        fetchAppointments();
        setShowCancelDialog(false);
        setCancellingId(null);
      } else {
        alert(data.error || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("An error occurred while cancelling the appointment");
    }
  };

  const canCancelOrReschedule = (appointmentDate: string, appointmentStatus: string) => {
    if (appointmentStatus === "cancelled" || appointmentStatus === "completed") {
      return false;
    }

    const now = new Date();
    const aptDate = new Date(appointmentDate);
    const hoursDiff = (aptDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursDiff >= 24;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) >= new Date();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  const upcomingAppointments = appointments.filter((apt) => isUpcoming(apt.appointmentDate));
  const pastAppointments = appointments.filter((apt) => !isUpcoming(apt.appointmentDate));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-2">View and manage your service bookings</p>
        </div>

        <div className="mb-4">
          <Button
            onClick={() => router.push("/services")}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Book New Appointment
          </Button>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Appointments Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't booked any services. Browse our services to get started.
              </p>
              <Button
                onClick={() => router.push("/services")}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Browse Services
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Upcoming Appointments
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingAppointments.map((appointment) => (
                    <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">
                              {appointment.service.name}
                            </CardTitle>
                            <CardDescription>
                              {appointment.service.description}
                            </CardDescription>
                          </div>
                          {appointment.service.imageUrl && (
                            <div className="relative w-16 h-16 ml-4 rounded overflow-hidden">
                              <Image
                                src={appointment.service.imageUrl}
                                alt={appointment.service.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                          <span>
                            {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="w-4 h-4 mr-2 text-orange-600" />
                          <span>
                            {new Date(appointment.appointmentDate).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {appointment.service.durationMins &&
                              ` (${appointment.service.durationMins} mins)`}
                          </span>
                        </div>
                        {appointment.notes && (
                          <div className="flex items-start text-gray-700">
                            <FileText className="w-4 h-4 mr-2 mt-1 text-orange-600 flex-shrink-0" />
                            <span className="text-sm">{appointment.notes}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                          <span className="text-lg font-bold text-orange-600">
                            KES {appointment.service.price?.toLocaleString()}
                          </span>
                        </div>
                        {canCancelOrReschedule(appointment.appointmentDate, appointment.status) && (
                          <div className="flex gap-2 pt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/services/${appointment.service.id}/book?reschedule=${appointment.id}`)}
                              className="flex-1"
                            >
                              <CalendarClock className="w-4 h-4 mr-2" />
                              Reschedule
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setCancellingId(appointment.id);
                                setShowCancelDialog(true);
                              }}
                              className="flex-1"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Past Appointments
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastAppointments.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className="opacity-75 hover:opacity-100 transition-opacity"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">
                              {appointment.service.name}
                            </CardTitle>
                            <CardDescription>
                              {appointment.service.description}
                            </CardDescription>
                          </div>
                          {appointment.service.imageUrl && (
                            <div className="relative w-16 h-16 ml-4 rounded overflow-hidden">
                              <Image
                                src={appointment.service.imageUrl}
                                alt={appointment.service.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          <span>
                            {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          <span>
                            {new Date(appointment.appointmentDate).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                          <span className="text-lg font-bold text-gray-600">
                            KES {appointment.service.price?.toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
              Please note that appointments can only be cancelled at least 24 hours in advance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCancellingId(null)}>
              Keep Appointment
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelAppointment}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
