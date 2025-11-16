import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import Loading from "../../components/Loading";
import { Api } from "../../lib/api";

export default function DriverProfile() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const [driver, setDriver] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get(`/admin/users/${id}`);
      // Backend admin.users route should return user + driver relation
      setDriver(res.user ?? res);
    } catch (e) {
      setDriver(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;
  if (!driver) return <div className="text-red-600">Driver not found</div>;

  return (
    <div>
      <PageTitle>Driver {driver.driver?.id ?? driver.id}</PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white p-4 rounded shadow space-y-4">
          <div>
            <h4 className="text-sm text-gray-500">Profile</h4>
            <div className="mt-2">
              <div><strong>Name:</strong> {driver.name}</div>
              <div><strong>Email:</strong> {driver.email}</div>
              <div><strong>Phone:</strong> {driver.driver?.phone}</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm text-gray-500">Vehicle</h4>
            <div className="mt-2">
              {driver.driver?.vehicle ? (
                <>
                  <div><strong>Make:</strong> {driver.driver.vehicle.make}</div>
                  <div><strong>Model:</strong> {driver.driver.vehicle.model}</div>
                  <div><strong>Reg No:</strong> {driver.driver.vehicle.regNo}</div>
                </>
              ) : (
                <div>No vehicle on file</div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm text-gray-500">Account</h4>
            <div className="mt-2">
              <div><strong>Joined:</strong> {new Date(driver.createdAt).toLocaleString()}</div>
              <div><strong>Status:</strong> {driver.suspended ? "Suspended" : "Active"}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Link to={`/drivers/payouts?driverId=${driver.driver?.id}`} className="px-3 py-2 bg-blue-600 text-white rounded">View Payouts</Link>
            <Link to={`/drivers/trips?driverId=${driver.driver?.id}`} className="px-3 py-2 bg-gray-100 rounded">View Trips</Link>
          </div>
        </div>

        <div className="col-span-1 bg-white p-4 rounded shadow">
          <h4 className="text-sm text-gray-500">Balance</h4>
          <div className="mt-2 text-2xl font-semibold KES">KES {((driver.driver?.balance ?? 0) / 100).toFixed(2)}</div>
          <div className="mt-4 text-sm text-gray-500">Payouts and ledger available in payouts section.</div>
        </div>
      </div>
    </div>
  );
}
