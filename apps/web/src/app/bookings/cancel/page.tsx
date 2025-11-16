// apps/web/src/app/booking/cancel/page.tsx
export default function Cancel() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-2xl font-semibold">Payment cancelled</h1>
        <p className="mt-3 text-gray-600">Your payment session was cancelled. No booking was created.</p>
        <div className="mt-6">
          <a className="px-4 py-2 bg-primary text-white rounded" href="/">Back to home</a>
        </div>
      </div>
    </div>
  );
}
