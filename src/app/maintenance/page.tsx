"use client";
import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Wrench,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  durationMins: number | null;
}

interface UserCar {
  id: number;
  nickname: string | null;
  licensePlate: string | null;
  generation: {
    name: string;
    yearRange: string | null;
    model: {
      name: string;
      make: { name: string };
    };
  };
}

interface Appointment {
  id: number;
  scheduledDate: string;
  status: string;
  notes: string | null;
  car: {
    nickname: string | null;
    licensePlate: string | null;
  };
  service: {
    name: string;
    description: string | null;
    price: number | null;
    durationMins: number | null;
  };
  statusUpdates: Array<{
    id: number;
    status: string;
    message: string | null;
    createdAt: string;
  }>;
}

export default function MaintenancePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [userCars, setUserCars] = useState<UserCar[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [notes, setNotes] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // In production, get userId from auth context/session
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }

    fetch("/api/service")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`/api/cars/user?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => setUserCars(data))
        .catch(console.error);

      fetch(`/api/maintenance/appointments?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => setAppointments(data))
        .catch(console.error);
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !userId ||
      !selectedService ||
      !selectedCar ||
      !scheduledDate ||
      !scheduledTime
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);

      const res = await fetch("/api/maintenance/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userCarId: selectedCar,
          serviceId: selectedService,
          scheduledDate: dateTime.toISOString(),
          notes,
        }),
      });

      if (res.ok) {
        const newAppointment = await res.json();
        setAppointments([newAppointment, ...appointments]);
        setShowForm(false);
        setSelectedService(null);
        setSelectedCar(null);
        setScheduledDate("");
        setScheduledTime("");
        setNotes("");
        alert("Appointment scheduled successfully!");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to schedule appointment");
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert("Failed to schedule appointment");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "in_progress":
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-semibold mb-4">
              Maintenance Services
            </h1>
            <p className="text-xl text-[#86868b]">
              Schedule and track your vehicle maintenance
            </p>
          </div>
          {userId && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="apple-button"
            >
              <Wrench className="w-4 h-4 mr-2 inline" />
              Schedule Appointment
            </button>
          )}
        </div>

        {!userId ? (
          <div className="text-center py-20 bg-[#f5f5f7] rounded-2xl">
            <p className="text-xl text-[#86868b] mb-4">
              Please log in to schedule appointments
            </p>
            <a href="/auth/login" className="apple-button">
              Log In
            </a>
          </div>
        ) : (
          <>
            {showForm && (
              <div className="bg-[#f5f5f7] rounded-2xl p-8 mb-12">
                <h2 className="text-3xl font-semibold mb-6">
                  Schedule New Appointment
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Service *
                      </label>
                      <select
                        value={selectedService || ""}
                        onChange={(e) =>
                          setSelectedService(
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white"
                        required
                      >
                        <option value="">Select Service</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name}{" "}
                            {service.price &&
                              `($${(service.price / 100).toFixed(2)})`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Car *
                      </label>
                      <select
                        value={selectedCar || ""}
                        onChange={(e) =>
                          setSelectedCar(
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white"
                        required
                      >
                        <option value="">Select Car</option>
                        {userCars.map((car) => (
                          <option key={car.id} value={car.id}>
                            {car.nickname ||
                              `${car.generation.model.make.name} ${car.generation.model.name} ${car.generation.name}`}
                            {car.licensePlate && ` (${car.licensePlate})`}
                          </option>
                        ))}
                      </select>
                      {userCars.length === 0 && (
                        <p className="text-sm text-[#86868b] mt-2">
                          <a
                            href="/garage"
                            className="text-[#0071e3] underline"
                          >
                            Add a car to your garage
                          </a>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Time *
                      </label>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white"
                      placeholder="Any special instructions or concerns..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="apple-button disabled:opacity-50"
                    >
                      {loading ? "Scheduling..." : "Schedule Appointment"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="apple-button apple-button-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Appointments List */}
            <div>
              <h2 className="text-3xl font-semibold mb-6">Your Appointments</h2>
              {appointments.length === 0 ? (
                <div className="text-center py-20 bg-[#f5f5f7] rounded-2xl">
                  <Calendar className="w-16 h-16 text-[#86868b] mx-auto mb-4" />
                  <p className="text-xl text-[#86868b]">
                    No appointments scheduled
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="apple-card">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-semibold mb-2">
                            {appointment.service.name}
                          </h3>
                          <p className="text-[#86868b]">
                            {appointment.car.nickname || "Your Car"}
                            {appointment.car.licensePlate &&
                              ` • ${appointment.car.licensePlate}`}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status.replace("_", " ").toUpperCase()}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-[#86868b]" />
                          <span className="text-[#86868b]">
                            {new Date(
                              appointment.scheduledDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-[#86868b]" />
                          <span className="text-[#86868b]">
                            {new Date(
                              appointment.scheduledDate
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {appointment.service.price && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#86868b]">Price:</span>
                            <span className="font-semibold">
                              ${(appointment.service.price / 100).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>

                      {appointment.notes && (
                        <p className="text-[#86868b] mb-4">
                          {appointment.notes}
                        </p>
                      )}

                      {/* Status Updates */}
                      {appointment.statusUpdates.length > 0 && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-semibold mb-3">
                            Progress Updates
                          </h4>
                          <div className="space-y-2">
                            {appointment.statusUpdates.map((update) => (
                              <div
                                key={update.id}
                                className="flex items-start gap-3"
                              >
                                {getStatusIcon(update.status)}
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    {update.status
                                      .replace("_", " ")
                                      .toUpperCase()}
                                  </p>
                                  {update.message && (
                                    <p className="text-sm text-[#86868b]">
                                      {update.message}
                                    </p>
                                  )}
                                  <p className="text-xs text-[#86868b] mt-1">
                                    {new Date(
                                      update.createdAt
                                    ).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
