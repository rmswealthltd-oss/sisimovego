import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

export default function AdminRouter() {
  return <RouterProvider router={router} />;
}
