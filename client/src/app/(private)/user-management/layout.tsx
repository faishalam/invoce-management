import { UserManagementProvider } from "./hooks";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserManagementProvider>{children}</UserManagementProvider>
    </>
  );
}
