"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../dashboard/layout";
import { useAuth } from "@/context/AuthContext";
import { Api } from "@/lib/api";
import {
  FiCreditCard,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiDollarSign,
  FiInfo,
} from "react-icons/fi";
import { OnboardingBanner } from "@/components/dashboard/OnboardingBanner";
import { TripStatus, TripView, BookingView } from "../../../../types/trip";

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center p-10 border border-dashed border-gray-300 rounded-xl text-gray-400 space-y-2">
    <FiInfo className="text-3xl" />
    <p>{message}</p>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [bookings, setBookings] = useState<BookingView[]>([]);
  const [trips, setTrips] = useState<TripView[]>([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    completedTrips: 0,
    totalEarnings: 0,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  // Fetch dashboard data
  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        // DRIVER
        if (user.role === "DRIVER" && user.driverLicenseStatus === "VERIFIED") {
          const walletRes = await Api.get<{ balance: number }>("/drivers/wallet/me");
          setWalletBalance(walletRes.balance);

          const driverTrips = await Api.get<TripView[]>("/drivers/trips");
          setTrips(driverTrips);

          const completedTrips = driverTrips.filter(
            t => t.status === TripStatus.COMPLETED
          ).length;

          const totalEarnings = driverTrips
            .filter(t => t.status === TripStatus.COMPLETED)
            .reduce((acc, t) => acc + t.pricePerSeat * t.totalSeats, 0);

          setStats({
            totalTrips: driverTrips.length,
            completedTrips,
            totalEarnings,
          });
        }

        // PASSENGER
        if (user.role === "PASSENGER") {
          const myBookings = await Api.get<BookingView[]>("/passengers/bookings/my");
          setBookings(myBookings);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading || !user) return <div>Loading…</div>;

  return (
    <DashboardLayout>
      <OnboardingBanner user={user} />

      {/* DRIVER Stats */}
      {user.role === "DRIVER" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="bg-white border rounded-xl shadow p-5 flex items-center gap-3">
            <FiTruck className="text-primary text-2xl" />
            <div>
              <p className="text-xs text-gray-500">Total Trips</p>
              <p className="text-lg font-semibold">{stats.totalTrips}</p>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow p-5 flex items-center gap-3">
            <FiCheckCircle className="text-primary text-2xl" />
            <div>
              <p className="text-xs text-gray-500">Completed Trips</p>
              <p className="text-lg font-semibold">{stats.completedTrips}</p>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow p-5 flex items-center gap-3">
            <FiDollarSign className="text-primary text-2xl" />
            <div>
              <p className="text-xs text-gray-500">Total Earnings</p>
              <p className="text-lg font-semibold">
                KES {(stats.totalEarnings / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Wallet & Bookings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.role === "DRIVER" && user.driverLicenseStatus === "VERIFIED" && (
          <div className="bg-white border rounded-xl shadow p-5">
            <h3 className="font-semibold flex items-center gap-2 mb-1">
              <FiCreditCard className="text-primary" /> Wallet Balance
            </h3>
            <p className="text-2xl font-bold mt-2">
              {walletBalance === null
                ? "—"
                : `KES ${(walletBalance / 100).toFixed(2)}`}
            </p>
          </div>
        )}

        <div className="bg-white border rounded-xl shadow p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <FiClock className="text-primary" /> Upcoming Bookings
          </h3>
          {bookings.length === 0 ? (
            <EmptyState message="No upcoming bookings yet" />
          ) : (
            <ul className="space-y-2">
              {bookings.slice(0, 5).map(b => (
                <li key={b.id} className="text-sm border-b pb-2">
                  <p className="font-medium">
                    {b.trip.toLocation} → {b.trip.fromLocation}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(b.trip.departureAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Trips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {trips.length === 0 ? (
          <EmptyState message="No trips available yet" />
        ) : (
          trips.map(trip => (
            <div key={trip.id} className="relative bg-white border rounded-xl shadow p-5">
              <p className="font-semibold">
                {trip.toLocation} → {trip.fromLocation}
              </p>
              <span className="text-xs inline-block px-2 py-1 bg-gray-100 rounded mt-2">
                {trip.status}
              </span>

              <div className="absolute bottom-4 right-4 space-x-2">
                {/* PASSENGER actions */}
                {user.role === "PASSENGER" && trip.status === TripStatus.REQUESTING && (
                  user.governmentIdStatus !== "VERIFIED" ? (
                    <button
                      onClick={() => router.push("/profile/verify-id")}
                      className="py-2 px-4 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                    >
                      Verify ID to Join Trip
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push(`/trips/${trip.id}`)}
                      className="py-2 px-4 bg-primary text-white rounded-lg text-sm hover:bg-primary/90"
                    >
                      Join Trip
                    </button>
                  )
                )}

                {/* DRIVER actions */}
                {user.role === "DRIVER" && trip.status === TripStatus.REQUESTING && (
                  user.driverLicenseStatus !== "VERIFIED" ? (
                    <button
                      onClick={() => router.push("/profile/verify-license")}
                      className="py-2 px-4 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                    >
                      Verify License to Post Trip
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push(`/trips/${trip.id}`)}
                      className="py-2 px-4 bg-primary text-white rounded-lg text-sm hover:bg-primary/90"
                    >
                      Post Trip
                    </button>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
