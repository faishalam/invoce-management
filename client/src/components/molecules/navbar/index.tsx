"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks";

const userNavigation = [{ name: "Sign out" }];

export default function Navbar() {
  const { dataUser, setSidebarOpen, isLoadingGetUserLoggedIn } = useAuth();

  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
    localStorage.clear();
  };
  return (
    <>
      <div className="sticky top-0 z-40 flex shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="h-6 w-6" />
        </button>

        <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />

        <div className="flex max-w-full w-full items-center justify-end gap-x-4 lg:gap-x-6 p-3">
          <Link
            href={"https://www.kppmining.com/"}
            className="text-green-900 text-xs font-semibold hover:underline"
          >
            Official Website
          </Link>
          <div className="flex items-center justify-end gap-x-4 lg:gap-x-6">
            <div
              aria-hidden="true"
              className=" block h-6 w-px lg:bg-gray-900/10"
            />
            <Menu as="div" className="relative">
              <MenuButton className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                {isLoadingGetUserLoggedIn ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="flex items-center">
                        <div className="h-5 w-20 rounded-md bg-gray-200 animate-pulse ml-4"></div>
                        <div className="ml-2 h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Image
                      src="/assets/avatarUser.png"
                      alt="avatar"
                      width={100}
                      height={100}
                      className="h-8 w-8 rounded-full bg-gray-50"
                    />
                    <span className="flex items-center">
                      <span
                        aria-hidden="true"
                        className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                      >
                        {dataUser?.data?.username}
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 text-gray-400"
                      />
                    </span>
                  </>
                )}
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {userNavigation.map((item) => (
                  <MenuItem key={item.name}>
                    <Link
                      href={"/login"}
                      onClick={() => handleLogout()}
                      className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                    >
                      {item.name}
                    </Link>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </>
  );
}
