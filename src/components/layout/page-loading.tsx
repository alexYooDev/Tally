import { LoadingSpinner } from "@/components/feedback/loading-spinner";

export function PageLoading() {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}
