import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
export const ErrorState = ({ error }: { error?: string }) => (
  <motion.div className="text-red-500 text-center mt-8 p-8 bg-destructive/10 rounded-lg shadow-lg flex flex-col items-center justify-center w-full">
    <AlertCircle className="mb-4 text-4xl" />
    <h3 className="text-xl font-semibold mb-2">Error fetching results</h3>
    <p className="text-muted-foreground">
      Please try again later or check your connection.
    </p>
    {error && <p className="text-red-500">{error}</p>}
  </motion.div>
);
