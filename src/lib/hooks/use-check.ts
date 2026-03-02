import { useIsAuthenticated } from "@refinedev/core";

export function useCheck() {
  const {
    data: userData,
    isSuccess,
    isLoading: isAuthLoading,
    isError: isAuthError,
  } = useIsAuthenticated();

  return {userData, isSuccess, isAuthLoading, isAuthError};
}