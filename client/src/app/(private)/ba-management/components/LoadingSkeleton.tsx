"use client";
import { Skeleton } from "@mui/material";

export default function BeritaAcaraPageSkeleton() {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <Skeleton variant="text" width={250} height={36} />
          <Skeleton variant="text" width={180} height={20} />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="rounded" width={130} height={40} />
          <Skeleton variant="rounded" width={130} height={40} />
        </div>
      </div>

      {/* CardHeader */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white shadow rounded-md flex gap-3 px-4 py-4 items-center"
          >
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex flex-col gap-1 w-full">
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={28} />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white shadow rounded-md flex gap-3 px-4 py-4 items-center"
          >
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex flex-col gap-1 w-full">
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={28} />
            </div>
          </div>
        ))}
      </div>

      {/* Filter section */}
      <div className="w-full bg-white shadow rounded-md p-4 flex flex-col gap-4">
        <div className="w-full flex gap-3">
          {/* Search Input */}
          <div className="flex max-w-lg w-[50%] flex-col gap-2">
            <Skeleton variant="text" width="30%" height={20} />
            <Skeleton variant="rounded" height={42} className="w-full" />
          </div>

          {/* 4 Autocomplete */}
          <div className="flex max-w-full gap-3 w-full">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2 w-full">
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="rounded" height={42} className="w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="w-full h-[34vh] flex flex-col gap-2 mt-2">
          <div className="flex gap-3 px-3">
            <Skeleton variant="rounded" width="100%" height={250} />
          </div>
        </div>
      </div>
    </div>
  );
}
