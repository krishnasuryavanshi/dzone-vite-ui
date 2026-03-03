
import React from "react";
import { ErrorContainer } from "@/components/shared";

const ErrorBoundry = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  return (
    <ErrorContainer error={error} reset={reset} />
  );
};

export default ErrorBoundry;