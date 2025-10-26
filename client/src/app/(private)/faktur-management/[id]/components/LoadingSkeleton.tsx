import { Skeleton } from "@mui/material";

export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Section 1: Info Berita Acara */}
      <div className="bg-white shadow rounded-md p-6 flex flex-col gap-4">
        <Skeleton variant="text" width={280} height={30} />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={56} />
          ))}
        </div>
        <Skeleton variant="rounded" height={100} />
      </div>

      {/* Section 2: Identifikasi Faktur */}
      <div className="bg-white shadow rounded-md p-6 flex flex-col gap-4">
        <Skeleton variant="text" width={240} height={30} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={56} />
          ))}
        </div>
      </div>

      {/* Section 3: Uraian Debit Note */}
      <div className="bg-white shadow rounded-md p-6 flex flex-col gap-4">
        <Skeleton variant="text" width={260} height={30} />
        <Skeleton variant="rounded" height={56} width="50%" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 p-4 border rounded-md">
              {Array.from({ length: 7 }).map((_, j) => (
                <Skeleton key={j} variant="rounded" height={56} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
