"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar as CalendarIcon, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Appointment {
  id: number;
  appointmentDate: string;
  status: string;
  notes: string | null;
  createdAt: string;
  service: {
    id: number;
    name: string;
    price: number;
    durationMins: number | null;
  };
}

export default function AdminAppointmentsPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchAppointments();
    }
  }, [session]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/admin/appointments");
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

  const handleUpdateStatus = async () => {
    if (!selectedAppointment || !newStatus) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        setAppointments(
          appointments.map((apt) =>
            apt.id === selectedAppointment.id
              ? { ...apt, status: newStatus }
              : apt
          )
        );
        setSelectedAppointment(null);
        alert("Appointment status updated successfully");
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred");
    } finally {
      setUpdating(false);
    }
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

  const filteredAppointments =
    statusFilter === "all"
      ? appointments
      : appointments.filter((apt) => apt.status.toLowerCase() === statusFilter);

  const upcomingAppointments = filteredAppointments.filter(
    (apt) => new Date(apt.appointmentDate) >= new Date()
  );

  const pastAppointments = filteredAppointments.filter(
    (apt) => new Date(apt.appointmentDate) < new Date()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Appointments Management
        </h1>
        <p className="text-gray-600">
          View and manage all service appointments
        </p>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Appointments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500">
              {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              Upcoming Appointments ({upcomingAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <span className="font-semibold">#{appointment.id}</span>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{appointment.service.name}</p>
                        {appointment.notes && (
                          <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                            {appointment.notes}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(appointment.appointmentDate).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {appointment.service.durationMins
                            ? `${appointment.service.durationMins} mins`
                            : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-orange-600">
                          KES {appointment.service.price.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setNewStatus(appointment.status);
                          }}
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Past Appointments ({pastAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastAppointments.map((appointment) => (
                    <TableRow key={appointment.id} className="opacity-75">
                      <TableCell>
                        <span className="font-semibold">#{appointment.id}</span>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{appointment.service.name}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-gray-600">
                          KES {appointment.service.price.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredAppointments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {statusFilter === "all"
                ? "No appointments yet"
                : `No ${statusFilter} appointments`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Update Status Dialog */}
      <Dialog
        open={selectedAppointment !== null}
        onOpenChange={() => setSelectedAppointment(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Appointment Status</DialogTitle>
            <DialogDescription>
              Appointment #{selectedAppointment?.id} - {selectedAppointment?.service.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedAppointment(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updating || newStatus === selectedAppointment?.status}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    
  );
}
