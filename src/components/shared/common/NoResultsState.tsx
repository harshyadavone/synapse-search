import { motion } from "framer-motion";
import { Search } from "lucide-react";
export const NoResultsState: React.FC<{ query?: string }> = ({ query }) => (
  <motion.div className="text-center mt-8 p-8 bg-card/20 rounded-lg shadow-lg">
    <Search className="mx-auto mb-4 text-4xl text-card-foreground" />
    <h3 className="text-xl font-semibold mb-2">
      {query ? `No results found for ${query}` : "No results found"}
    </h3>
    <p className="text-muted-foreground">
      Try adjusting your search terms or explore different topics.
    </p>
  </motion.div>
);
