"use client";

import { ModalWarningInfoProvider } from "@/components/atoms/modal-warning";
import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return <ModalWarningInfoProvider>{children}</ModalWarningInfoProvider>;
}
