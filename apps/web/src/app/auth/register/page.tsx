// apps/web/src/app/auth/register/page.tsx
import dynamic from "next/dynamic";
import { buildMeta } from "@/lib/seo";

const RegisterForm = dynamic(() => import("./_RegisterForm"), { ssr: false });

export const metadata = buildMeta({ title: "Register • SisiMove" });

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create an account</h1>
      <RegisterForm />
    </div>
  );
}
