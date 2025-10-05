"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

type TProps = {
  children?: React.ReactNode;
};
const PublicLayout: React.FC<TProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen no-scrollbar">
      <div className="w-full h-[calc(100vh-4.25rem) bg0]">{children}</div>
    </div>
  );
};
export default PublicLayout;
