"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { IntentKey } from "@/types/intent";

type IntentContextValue = {
  intent: IntentKey | null;
  setIntent: (key: IntentKey) => void;
};

const IntentContext = createContext<IntentContextValue | null>(null);

export function IntentProvider({ children }: { children: ReactNode }) {
  const [intent, setIntent] = useState<IntentKey | null>(null);
  return (
    <IntentContext.Provider value={{ intent, setIntent }}>{children}</IntentContext.Provider>
  );
}

export function useIntent(): IntentContextValue {
  const ctx = useContext(IntentContext);
  if (!ctx) throw new Error("useIntent must be used within IntentProvider");
  return ctx;
}
