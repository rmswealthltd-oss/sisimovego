// apps/web/src/app/trip/[tripId]/realtime/page.tsx
import dynamic from "next/dynamic";
import { buildMeta } from "@/lib/seo";

const RealtimeClient = dynamic(() => import("./ClientWrapper"), { ssr: false });

export const metadata = buildMeta({ title: "Trip realtime" });

export default function RealtimePage({ params }: { params: { tripId: string } }) {
  const tripId = params.tripId;
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Live trip tracking</h1>
      <div className="mt-4">
        <RealtimeClient tripId={tripId} />
      </div>
    </div>
  );
}
