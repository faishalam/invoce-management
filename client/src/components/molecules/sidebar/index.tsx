"use client";
import ArticleIcon from "@mui/icons-material/Article";
import { motion, AnimatePresence } from "framer-motion";
import logoKpp from "@/assets/img/kpp-logo.png";
import CLink from "@/components/atoms/link";
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useGlobal from "@/app/(private)/hooks";
import Image from "next/image";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { dataUserProfile, isLoadingUserProfile } = useGlobal();
  const queryClient = useQueryClient();

  const sidebarClass = useMemo(() => {
    if (pathname.includes("/messages")) return "hidden";
    return "w-full h-full box-border p-2 bg-slate-900 flex flex-col justify-between";
  }, [pathname]);

  const handleLogout = () => {
    queryClient.clear();
    Cookies.remove("accessToken");
    router.push("/login");
    toast.success("Logout Berhasil");
  };

  return (
    <AnimatePresence mode="wait">
      {!isLoadingUserProfile && (
        <motion.div
          key="sidebar"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className={sidebarClass}
        >
          <div>
            <div className="h-[55px] justify-start p-3 items-center flex gap-2 border-b border-gray-300 mb-10">
              {/* <div className="flex gap-4 justify-center items-center w-6 h-6 border bg-[#2784c7] rounded-md"> */}
              <Image
                src={logoKpp}
                alt="logo.png"
                width={70}
                height={50}
                className=""
                priority
              />
              {/* </div> */}
              <div>
                <p className="text-white text-xs font-bold">BA & DN</p>
                <p className="text-white text-xs font-bold">Management</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {/* <MenuItems
            Icon={DashboardIcon}
            title="Dashboard"
            selected={pathname.startsWith("/dashboard")}
            href="/dashboard"
          /> */}
              <MenuItems
                Icon={ArticleIcon}
                title="BA Management"
                selected={pathname.startsWith("/ba-management")}
                href="/ba-management"
              />
              <MenuItems
                Icon={ArticleIcon}
                title="DN Management"
                selected={pathname.startsWith("/dn-management")}
                href="/dn-management"
              />
              <MenuItems
                Icon={ArticleIcon}
                title="Faktur Management"
                selected={pathname.startsWith("/faktur-management")}
                href="/faktur-management"
              />
              {dataUserProfile?.data?.role === "superadmin" && (
                <>
                  <MenuItems
                    Icon={PersonIcon}
                    title="User Management"
                    selected={pathname.startsWith("/user-management")}
                    href="/user-management"
                  />
                  <MenuItems
                    Icon={FolderIcon}
                    title="Data Management"
                    selected={pathname.startsWith("/data-management")}
                    href="/data-management"
                  />
                </>
              )}
            </div>
          </div>

          <button
            className="group text-white w-full rounded-md p-3 cursor-pointer transition-colors flex items-center gap-2 border-gray-200 bg-transparent hover:bg-[#fef7ed]"
            onClick={handleLogout}
          >
            <LogoutIcon
              sx={{ fontSize: "1rem" }}
              className="text-white transition-colors group-hover:text-[#f46e31]"
            />
            <small className="font-medium text-white transition-colors group-hover:text-[#f46e31]">
              Logout
            </small>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;

type TMenuItemProps = {
  selected: boolean;
  title: string;
  Icon: React.ElementType;
  href?: string;
};

const MenuItems: React.FC<TMenuItemProps> = ({
  selected,
  title,
  Icon,
  href,
}) => {
  return (
    <CLink href={href ?? ""} prefetch>
      <div
        className={`group flex items-center gap-2 p-3 rounded-md cursor-pointer transition-colors
      ${selected ? "bg-[#fef7ed]" : "hover:bg-[#fef7ed]"}
    `}
      >
        <Icon
          sx={{ fontSize: "1rem" }}
          className={`
        transition-colors
        ${selected ? "text-[#f46e31]" : "text-white group-hover:text-[#f46e31]"}
      `}
        />

        <small
          className={`font-medium text-xs transition-colors
        ${selected ? "text-[#f46e31]" : "text-white group-hover:text-[#f46e31]"}
      `}
        >
          {title}
        </small>
      </div>
    </CLink>
  );
};
