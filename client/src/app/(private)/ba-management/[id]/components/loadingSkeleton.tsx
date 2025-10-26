import Skeleton from "@mui/material/Skeleton";

export default function BeritaAcaraSkeleton() {
  return (
    <>
      {/* IdentifyForm Skeleton */}
      <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4 animate-pulse">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={200} height={32} />
        </div>
        <div className="border-t border-gray-200 -mx-6" />
        <div className="w-full flex gap-6">
          <div className="w-full flex flex-col gap-2">
            <Skeleton variant="rectangular" height={56} />
            <Skeleton variant="rectangular" height={56} />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Skeleton variant="rectangular" height={56} />
            <Skeleton variant="rectangular" height={56} />
          </div>
        </div>
      </div>

      {/* InformationForm Skeleton */}
      <div className="w-full bg-white rounded-md shadow flex flex-col p-6 gap-4 animate-pulse">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={200} height={32} />
        </div>
        <div className="border-t border-gray-200 -mx-6" />
        <div className="w-full flex gap-6">
          <div className="w-full flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={`left-${i}`} variant="rectangular" height={56} />
            ))}
          </div>
          <div className="w-full flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={`right-${i}`} variant="rectangular" height={56} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
