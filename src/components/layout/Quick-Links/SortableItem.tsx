"use client";
import React, { useState, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QuickLink } from "./QuickLinks";

const SortableItem: React.FC<{ link: QuickLink }> = ({ link }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  const [isClicking, setIsClicking] = useState(false);

  const handleMouseDown = useCallback(() => {
    setIsClicking(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (isClicking) {
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
    setIsClicking(false);
  }, [isClicking, link.url]);

  const handleMouseMove = useCallback(() => {
    setIsClicking(false);
  }, []);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${isDragging ? "cursor-grabbing" : "cursor-pointer"}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div
        className={`
          flex flex-col items-center justify-center
          bg-accent/50 md:py-4 rounded-full md:rounded-lg
          hover:bg-secondary/20 transition-colors duration-200
          aspect-square
        `}
      >
        <div className="flex flex-col items-center space-y-2 overflow-hidden text-ellipsis w-full px-2">
          {link.icon.startsWith("http") ? (
            <img
              src={link.icon}
              alt={link.title}
              className="w-7 h-7 md:w-10 md:h-10 object-contain"
            />
          ) : (
            <div className="w-7 h-7 md:w-10 md:h-10  bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-semibold">
              {link.icon}
            </div>
          )}
          <span className="text-xs text-center font-medium leading-tight overflow-hidden text-ellipsis whitespace-nowrap w-full hidden md:block max-w-[80px] sm:max-w-none sm:whitespace-normal sm:line-clamp-2">
            {link.title}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SortableItem);
