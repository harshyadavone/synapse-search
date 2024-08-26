"use client";
import React, { useState, useEffect } from "react";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { QuickLink } from "./QuickLinks";

interface QuickLinkActionsProps {
  link: QuickLink;
  onEdit: (link: QuickLink) => void;
  onDelete: (id: string) => void;
  isHovered: boolean;
  isDragging: boolean;
}

const QuickLinkActions: React.FC<QuickLinkActionsProps> = ({
  link,
  onEdit,
  onDelete,
  isHovered,
  isDragging,
}) => {
  const [showIcon, setShowIcon] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovered && !isDragging) {
      timer = setTimeout(() => {
        setShowIcon(true);
      }, 50);
    } else {
      setShowIcon(false);
      setShowMenu(false);
    }
    return () => clearTimeout(timer);
  }, [isHovered, isDragging]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(link);
    setShowMenu(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(link.id);
    setShowMenu(false);
  };

  if (isDragging) return null;

  return (
    <div className="absolute top-2 right-2 z-5">
      <button
        onClick={toggleMenu}
        className={`p-1 rounded-md hover:bg-muted transition-all duration-300 ease-in-out ${
          showIcon || showMenu ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <MoreVertical className="h-5 w-5" />
      </button>
      {showMenu && (
        <div className="absolute w-36 top-8 right-0 bg-background border border-input shadow-lg rounded-md">
          <button
            onClick={handleEdit}
            className="flex items-center w-full text-lg px-3 py-3 hover:bg-accent/50"
          >
            <Edit size={18} className="mr-2" /> Edit
          </button>
          <div className="border-b" />
          <button
            onClick={handleDelete}
            className="flex items-center w-full text-lg px-3 py-3 text-red-500 hover:bg-destructive/10"
          >
            <Trash size={18} className="mr-2" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickLinkActions;
