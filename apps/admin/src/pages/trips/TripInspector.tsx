import React, { useEffect, useState, useCallback } from "react";
import PageTitle from "../../components/PageTitle";
import { Api } from "../../lib/api";
import Loading from "../../components/Loading";
import TripTimeline from "./TripTimeline";
import TripLiveCard from "./TripLiveCard";
import TripMapOps from "./TripMapOps";
import { useSearchParams } from "react-router-dom";

export default function TripInspector() {
  const [params] = useSearchParams();
  const tripId = params.get("id");

  const [trip, setTrip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTrip = useCallback(async () => {
    if (!tripId) {
      setTrip(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await Api.get(`/trips/${tripId}`);
      setTrip(res.trip);
    } catch (e) {
      setTrip(null);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  if (loading) return <Loading />;
  if (!trip) return <div className="p-6 text-gray-600">Trip not found.</div>;

  return (
    <div>
      <PageTitle>Trip #{trip.id}</PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <TripLiveCard trip={trip} />
          <TripTimeline events={trip.timeline ?? []} />
        </div>

        <div className="col-span-1">
          <TripMapOps trip={trip} />
        </div>
      </div>
    </div>
  );
}
