"use client";
import Image from "next/image";
import LogoutAccountIcon from "@mui/icons-material/Logout";
import { TProps } from "./types";
import NotificationIcon from "@mui/icons-material/Notifications";
import DropdownButton from "@/components/atoms/dropdown-button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Skeleton } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import useGlobal from "@/app/(private)/hooks";

const Navbar: React.FC<TProps> = ({ showRightMenu = true }) => {
  const { dataUserProfile, isLoadingUserProfile } = useGlobal();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    queryClient.clear();
    localStorage.clear();
    router.push("/login");
    Cookies.remove("accessToken");
    toast.success("Logout Success");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-3 shrink-0 h-[55px] bg-blue-50">
      {showRightMenu && (
        <div className="w-full flex justify-between items-center gap-4">
          <div className="text-xs text-gray-700">
            <p className="">
              {new Intl.DateTimeFormat("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "Asia/Jakarta",
              }).format(new Date())}
            </p>
          </div>
          <div className="flex justify-end items-center gap-4 flex-1">
            <div className="w-[30px] h-[30px] bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors shrink-0">
              <NotificationIcon
                className="text-gray-700"
                style={{ fontSize: "1.3rem" }}
              />
            </div>
            {isLoadingUserProfile ? (
              <ProfileDropdownSkeleton />
            ) : (
              <div className="pl-2 border-l border-l-gray-200 shrink-0">
                <DropdownButton
                  className="text-black"
                  menuItems={[
                    <div
                      key="logout"
                      onClick={() => handleLogout()}
                      className="flex text-sm items-center w-[150px] hover:bg-gray-100 cursor-pointer"
                    >
                      <LogoutAccountIcon />
                      <span className="ml-2">Logout</span>
                    </div>,
                  ]}
                >
                  <Image
                    src="https://img.freepik.com/premium-photo/happy-man-ai-generated-portrait-user-profile_1119669-1.jpg"
                    alt="Profile"
                    width={30}
                    height={30}
                    className="rounded-full w-[30px] h-[30px]"
                    unoptimized
                  />
                  <div className="grid text-sm justify-items-start text-gray-700 ml-1">
                    <div className="font-bold text-xs">
                      {dataUserProfile?.data?.name}
                    </div>
                    <small className="text-gray-500 text-xs">
                      {dataUserProfile?.data?.role}
                    </small>
                  </div>
                </DropdownButton>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

function ProfileDropdownSkeleton() {
  return (
    <div className="pl-4 border-l border-l-gray-200 shrink-0 flex items-center">
      {/* Avatar */}
      <Skeleton variant="circular" width={30} height={30} />

      {/* Name + Role */}
      <div className="grid text-sm justify-items-start ml-2">
        <Skeleton variant="text" width={80} height={18} />
        <Skeleton variant="text" width={50} height={14} />
      </div>
    </div>
  );
}

export default Navbar;
