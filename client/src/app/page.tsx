"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

const DefaultPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);
  return <></>;
};

export default DefaultPage;
