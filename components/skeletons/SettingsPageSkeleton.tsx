import { Skeleton } from "@/components/ui/skeleton";

export function SettingsPageTitleSkeleton() {
  return <Skeleton className="h-8 w-64 " />;
}

export function SettingsPageEditorSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-48 " />
      <Skeleton className="h-10 w-full " />
      <Skeleton className="h-64 w-full " />
    </div>
  );
}

export function SettingsPageButtonSkeleton() {
  return <Skeleton className="h-10 w-32 rounded-lg" />;
}

export default function SettingsPageSkeleton() {
  return (
    <div className="p-6 mx-4 my-10 space-y-6 bg-white rounded-2xl border border-solid border-[#ddd]">
      <SettingsPageTitleSkeleton />
      <SettingsPageEditorSkeleton />
      <SettingsPageEditorSkeleton />
      <SettingsPageButtonSkeleton />
    </div>
  );
}
