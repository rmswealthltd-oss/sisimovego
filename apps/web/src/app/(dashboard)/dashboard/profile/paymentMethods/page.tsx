// apps/web/src/app/profile/paymentMethods/page.tsx
import { apiGet } from "@/lib/serverApi";
import { ENDPOINTS } from "@/lib/config";
import { buildMeta } from "@/lib/seo";

export const metadata = buildMeta({ title: "Payment methods" });

export default async function PaymentMethodsPage() {
  // server-side fetch payment methods for user
  const res = await apiGet(ENDPOINTS.AUTH_ME.replace("/me", "/payments/methods")); // or use ENDPOINTS.PAYMENT_METHODS if defined
  const methods = res?.methods ?? res?.paymentMethods ?? [];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Payment Methods</h1>
      <div className="mt-4 space-y-3">
        {methods.length === 0 ? (
          <div className="text-gray-500">No payment methods saved</div>
        ) : methods.map((m:any)=> (
          <div key={m.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-medium">{m.brand} • **** {m.last4}</div>
              <div className="text-sm text-gray-500">{m.exp_month}/{m.exp_year}</div>
            </div>
            <div>
              <button className="px-3 py-1 border rounded">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
