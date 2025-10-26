import { Skeleton } from "@mui/material";

export default function UserFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center mb-6">
        <Skeleton
          variant="circular"
          width={128}
          height={128}
          className="mb-4"
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="rounded" width="100%" height={30} />
        </div>

        <div className="space-y-2">
          <Skeleton variant="text" width={80} height={20} />
          <Skeleton variant="rounded" width="100%" height={30} />
        </div>

        <div className="space-y-2">
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="rounded" width="100%" height={30} />
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" width={70} height={20} />
          <Skeleton variant="rounded" width="100%" height={30} />
        </div>

        <div className="space-y-2">
          <Skeleton variant="text" width={110} height={20} />
          <Skeleton variant="rounded" width="100%" height={30} />
        </div>
      </div>

      <div className="w-full flex justify-end mt-8 pt-4">
        <div className="flex justify-end gap-3 items-center w-full">
          <Skeleton variant="rounded" width="25%" height={42} />
          <Skeleton variant="rounded" width="25%" height={42} />
        </div>
      </div>
    </div>
  );
}
