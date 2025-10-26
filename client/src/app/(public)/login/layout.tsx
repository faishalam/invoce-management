import "../../../app/globals.css";
import { UserProvider } from "./hooks";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserProvider>{children}</UserProvider>
    </>
  );
}
