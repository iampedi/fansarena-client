import { LoaderCircleIcon } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <LoaderCircleIcon className="size-8 animate-spin" />
    </div>
  );
}
