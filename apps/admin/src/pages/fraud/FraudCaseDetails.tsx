import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { useSearchParams } from "react-router-dom";
import { Api } from "../../lib/api";
import Loading from "../../components/Loading";

export default function FraudCaseDetails() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) load(); }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await Api.get(`/fraud/cases/${id}`);
      setData(res.case);
    } catch (e) {
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;
  if (!data) return <div>Not found</div>;

  return (
    <div>
      <PageTitle>Fraud Case #{data.id}</PageTitle>

      <div className="bg-white p-4 rounded shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Subject</div>
            <div className="font-medium">{data.subject}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Score</div>
            <div className="font-medium">{data.score}</div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-700">{data.details}</div>
      </div>
    </div>
  );
}
