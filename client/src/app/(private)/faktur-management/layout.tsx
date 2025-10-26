import { Suspense } from "react";
import { FakturProvider } from "./hooks";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense>
        <FakturProvider>{children}</FakturProvider>
      </Suspense>
    </>
  );
}
