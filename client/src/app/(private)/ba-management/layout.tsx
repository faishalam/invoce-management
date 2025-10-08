import { BeritaAcaraProvider } from "./hooks";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <BeritaAcaraProvider>{children}</BeritaAcaraProvider>
    </>
  );
}
