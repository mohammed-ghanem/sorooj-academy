"use client";

import { useSessionReady } from "@/hooks/useSessionReady";

/** True after Providers read cookies and set axios auth (client-only). */
export function useStudentApiReady(): boolean {
  return useSessionReady();
}
