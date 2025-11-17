import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient configuration for React Query (TanStack Query).
 *
 * This instance sets default options for all queries:
 * - `refetchOnWindowFocus`: Disables automatic refetching when the window regains focus.
 * - `retry`: Limits failed query retries to 1 attempt.
 *
 * Use this configuration to initialize your application's QueryClient
 * for consistent query behavior across the app.
 */
export const queryClientConfig = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
