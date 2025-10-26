import { Suspense } from "react";
import { BeritaAcaraProvider } from "./hooks";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense>
        <BeritaAcaraProvider>{children}</BeritaAcaraProvider>
      </Suspense>
    </>
  );
}
