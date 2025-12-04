// src/app/DeleteConfirmationProvider.tsx
"use client";

import { useEffect } from "react";
import { registerDeleteConfirmation } from "./delete-confirmation";

export function DeleteConfirmationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    registerDeleteConfirmation();
  }, []);

  return <>{children}</>;
}
