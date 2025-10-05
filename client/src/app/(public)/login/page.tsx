"use client";

import Image from "next/image";
import FormLoginSection from "./components/FormLoginSection";

export default function LoginPage() {
  return (
    <>
      <div className="relative">
        <div className="h-screen w-screen overflow-hidden flex">
          <div className="hidden  lg:block w-full max-w-full">
            <div className="flex flex-col h-full bg-gray-300 rounded-r-3xl relative overflow-hidden p-16">
              <Image
                src="/assets/logo/logoPosindoWhite.png"
                alt="logo-pos-white.png"
                width={80}
                height={80}
                className="absolute z-10 right-10"
                priority
              />
              <Image
                alt="bg.jpg"
                src={
                  "https://static.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/2023/07/01/Lowongan-kerja-di-PT-Kalimantan-Prima-Persada-KPP-2898829358.jpg"
                }
                className="brightness-75"
                fill
                style={{ objectFit: "cover" }}
                priority
                unoptimized
              />
              <Image
                src="/assets/logo/bumn-white.png"
                alt="logo-pos-white.png"
                width={200}
                height={200}
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
