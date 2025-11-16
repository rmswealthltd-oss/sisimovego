// apps/web/src/lib/pushClient.ts
/**
 * pushClient
 * - registerSW(): registers the service worker and returns registration
 * - subscribeUser(): subscribes using the VAPID key and POSTs subscription to server
 * - getSubscription(): returns existing subscription from the SW pushManager
 * - unsubscribe(): unsubscribes locally and informs backend
 *
 * Backend endpoints expected:
 * POST /push/subscribe    { subscription }
 * GET  /push/subscriptions -> { subs: [...] } (optional)
 * DELETE /push/subscriptions/:id
 *
 * Ensure NEXT_PUBLIC_VAPID_KEY is set.
 */

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_KEY || "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerSW() {
  if (!("serviceWorker" in navigator)) throw new Error("Service workers unsupported");
  const reg = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;
  return reg;
}

export async function getSubscription() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;
  const reg = await navigator.serviceWorker.ready;
  return await reg.pushManager.getSubscription();
}

export async function subscribeUser(serverSubscribeUrl = "/push/subscribe") {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push not supported in this browser");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Permission not granted");

  const reg = await registerSW();
  const existing = await reg.pushManager.getSubscription();
  if (existing) return existing;

  const options = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  };

  const sub = await reg.pushManager.subscribe(options);
  // Send to backend to persist
  try {
    await fetch(serverSubscribeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription: sub }),
      credentials: "include"
    });
  } catch (err) {
    console.warn("Failed to send subscription to server:", err);
  }
  return sub;
}

export async function unsubscribeUser(serverUnsubscribeUrl = (id?: string) => `/push/subscriptions/${id}`) {
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return true;

  // attempt to inform backend (if you store an id mapping server-side)
  try {
    // If your server stores the endpoint as an id, pass it. Adjust as needed.
    await fetch(serverUnsubscribeUrl(encodeURIComponent(sub.endpoint)), {
      method: "DELETE",
      credentials: "include",
    });
  } catch (err) {
    console.warn("Failed to inform server about unsubscribe", err);
  }

  const ok = await sub.unsubscribe();
  return ok;
}
