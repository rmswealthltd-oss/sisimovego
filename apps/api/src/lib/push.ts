// src/lib/push.ts
export async function sendPushNotification(subscription: any, payload: any) {
  // implement web-push or FCM in production
  console.log("sendPushNotification", subscription, payload);
  return true;
}
