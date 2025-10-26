import { Suspense } from "react";
import { DebitNoteProvider } from "./hooks";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense>
        <DebitNoteProvider>{children}</DebitNoteProvider>
      </Suspense>
    </>
  );
}
