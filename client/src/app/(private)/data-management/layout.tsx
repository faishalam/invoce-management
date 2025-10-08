import { DataManagementProvider } from "./hooks";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DataManagementProvider>{children}</DataManagementProvider>
    </>
  );
}
