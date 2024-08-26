import { Loader } from "lucide-react";
import { memo } from "react";

const Spinner = memo(() => (
  <div className="flex flex-col items-center justify-center h-full w-full">
    <Loader className="animate-spin text-5xl text-primary" />
  </div>
));

export default Spinner;

Spinner.displayName = "Spinner";
