import { LoaderCircleIcon } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex h-full items-center justify-center">
      <LoaderCircleIcon className="animate-spin" />
    </div>
  );
}
