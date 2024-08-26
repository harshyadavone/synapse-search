import { Hcard } from "@/types";
import { motion } from "framer-motion";
import { Cake, MapPin, User } from "lucide-react";

const PersonalCard: React.FC<{
  combinedInfo: Hcard;
  image?: string;
  randomColor: string;
}> = ({ combinedInfo, image, randomColor }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 }}
    className={`rounded-2xl p-4 bg-gradient-to-t from-card to-transparent border border-opacity-5 border-card shadow-md shadow-${randomColor} hover:bg-muted/80 transition-colors duration-150`}
  >
    <div className="flex items-center gap-4 mb-4">
      {image && (
        <img
          src={image}
          alt={combinedInfo.fn || "Profile"}
          className="w-16 h-16 rounded-full object-cover"
        />
      )}
      <div>
        <h3 className="text-lg font-semibold text-primary">
          {combinedInfo.fn}
        </h3>
        {combinedInfo.role && (
          <p className="text-sm text-muted-foreground">{combinedInfo.role}</p>
        )}
      </div>
    </div>
    {combinedInfo.nickname && (
      <p className="flex items-center text-sm mb-2">
        <User size={16} className="inline mr-2 text-indigo-500" />
        <span className="text-card-foreground/85">{combinedInfo.nickname}</span>
      </p>
    )}
    {combinedInfo.bday && (
      <p className="text-sm mb-2">
        <Cake size={16} className="inline mr-2 text-indigo-500" />
        <span className="text-card-foreground/85">{combinedInfo.bday}</span>
      </p>
    )}
    {combinedInfo.label && (
      <p className="text-sm mb-2">
        <MapPin size={16} className="inline mr-2 text-indigo-500" />
        <span className="text-card-foreground/85">{combinedInfo.label}</span>
      </p>
    )}
  </motion.div>
);

export default PersonalCard;
