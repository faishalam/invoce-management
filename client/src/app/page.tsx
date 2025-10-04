"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DefaultPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);
  return <></>;
};

export default DefaultPage;
