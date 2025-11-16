// apps/web/src/app/auth/login/page.tsx
import dynamic from "next/dynamic";
import { buildMeta } from "@/lib/seo";

const LoginForm = dynamic(() => import("./_LoginForm"), { ssr: false });

export const metadata = buildMeta({ title: "Login • SisiMove" });

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <LoginForm />
    </div>
  );
}
