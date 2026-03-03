import { Suspense } from "react";
import { Navigate } from "react-router";
import { AuthGuard } from "../auth/auth-guard";

export default function IndexPage() {
  return (
    <Suspense>
      <AuthGuard>
        <Navigate to="/organizations" replace />
      </AuthGuard>
    </Suspense>
  );
}
