import { motion } from "framer-motion";
import { Loader } from "lucide-react";
export const LoadingState = () => (
  <motion.div className="flex flex-col items-center justify-center h-64 space-y-4">
    <Loader className="animate-spin text-5xl text-primary" />
    <p className="text-muted-foreground text-lg">Searching for results...</p>
  </motion.div>
);
