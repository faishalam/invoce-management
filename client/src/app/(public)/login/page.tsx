"use client";

import Image from "next/image";
import FormLoginSection from "./components/FormLoginSection";
import logoKpp from "@/assets/img/kpp-logo.png";
import logoSatuIndonesia from "@/assets/img/logo-satu-indonesia.png";

export default function LoginPage() {
  return (
    <>
      <div className="relative">
        <div className="h-screen w-screen overflow-hidden flex">
          <div className="hidden  lg:block w-full max-w-full">
            <div className="flex flex-col h-full bg-gray-300 rounded-r-3xl relative overflow-hidden p-16">
              <Image
                src={logoKpp}
                alt="logo.png"
                width={110}
                height={110}
                className="absolute z-10 right-10"
                priority
              />
              <Image
                alt="bg.jpg"
                src="https://www.digitalwarroom.com/hubfs/document%20management%20system.jpg"
                className="brightness-60"
                fill
                style={{
                  objectFit: "cover",
                  objectPosition: "right top",
                }}
                priority
                unoptimized
              />
              <Image
                src={logoSatuIndonesia}
                alt="logo.png"
                width={120}
                height={120}
                className="absolute z-10 "
                priority
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center text-white z-20">
                <p className="text-sm font-medium">
                  Powered By <b>PT Kalimantan Prima Persada</b>
                </p>
              </div>
            </div>
          </div>
          <div className="w-full max-w-full lg:max-w-1/3 flex justify-center items-center px-8 sm:px-16">
            <FormLoginSection />
          </div>
        </div>
      </div>
    </>
  );
}
