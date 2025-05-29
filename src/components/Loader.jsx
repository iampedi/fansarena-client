import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";

export default function Loader({ className }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <LoaderCircleIcon className="size-8 animate-spin" />
    </div>
  );
}
