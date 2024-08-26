import React from "react";
import Link from "next/link";
import {
  Image,
  Newspaper,
  Book,
  TrendingUp,
  Cpu,
  BrainCircuit,
} from "lucide-react";

interface QuickAccessItem {
  name: string;
  icon: React.ElementType;
  href: string;
}

const quickAccessItems: QuickAccessItem[] = [
  { name: "Images", icon: Image, href: "/search?type=images" },
  { name: "News", icon: Newspaper, href: "/search?type=news" },
  { name: "Research", icon: Book, href: "/search?type=research" },
  { name: "AI Tools", icon: BrainCircuit, href: "/ai-tools" },
  { name: "Trends", icon: TrendingUp, href: "/trends" },
  { name: "Tech", icon: Cpu, href: "/search?type=tech" },
];

export default function QuickAccess(): React.ReactElement {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-semibold mb-8 text-center text-foreground/90">
        Explore Synapse
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {quickAccessItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group flex flex-col items-center justify-center p-6 bg-card hover:bg-primary/5 rounded-2xl transition-all duration-300 border border-border hover:border-primary/50"
          >
            <div className="relative">
              <item.icon className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors duration-300" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary/20 rounded-full group-hover:animate-ping" />
            </div>
            <span className="mt-4 text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors duration-300">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
