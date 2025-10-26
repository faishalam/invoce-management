import { Skeleton } from "@mui/material";

export default function DebitNoteSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Informasi Customer */}
      <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={200} height={28} />
        </div>

        <div className="-mx-6 border-t border-gray-200" />

        <div className="flex flex-col gap-4">
          {/* Baris Input */}
          <div className="w-full flex gap-4 items-center">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full flex flex-col gap-2">
                <Skeleton variant="text" width="50%" height={20} />
                <Skeleton
                  variant="rounded"
                  height={44}
                  className="w-full rounded-md"
                />
              </div>
            ))}
          </div>

          {/* Alamat */}
          <div className="flex flex-col gap-2 mt-4">
            <Skeleton variant="text" width="30%" height={20} />
            <Skeleton
              variant="rounded"
              height={90}
              className="w-full rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Uraian Section Skeleton */}
      <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={180} height={28} />
        </div>
        <div className="-mx-6 border-t border-gray-200" />

        <div className="flex flex-col gap-4 mt-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={44}
              className="w-full rounded-md"
            />
          ))}
          <Skeleton variant="rounded" height={120} className="w-full rounded-md" />
        </div>
      </div>

      {/* Tombol Submit */}
      <div className="flex justify-end gap-4">
        <Skeleton variant="rounded" width={120} height={40} />
        <Skeleton variant="rounded" width={180} height={40} />
      </div>
    </div>
  );
}
