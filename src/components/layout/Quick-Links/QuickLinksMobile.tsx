"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Edit, Trash, X } from "lucide-react";
import { QuickLink } from "./QuickLinks";
import EditLinkForm from "@/components/shared/forms/EditLinkForm";
import AddLinkForm from "@/components/shared/forms/AddLinkForm";
import { DashboardSquareAddIcon } from "@/components/ui/icons";

let urlValidatorWorker: Worker | null = null;

const QuickLinksMobile: React.FC = () => {
  const [links, setLinks] = useState<QuickLink[]>(() => {
    if (typeof window !== "undefined") {
      const savedLinks = localStorage.getItem("quickLinks");
      return savedLinks ? JSON.parse(savedLinks) : [];
    } else {
      return [];
    }
  });

  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);

  useEffect(() => {
    if (typeof Worker !== "undefined") {
      urlValidatorWorker = new Worker(
        new URL("@/worker/urlValidator.worker", import.meta.url)
      );
    }

    return () => {
      urlValidatorWorker?.terminate();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("quickLinks", JSON.stringify(links));
  }, [links]);

  const addNewLink = useCallback((newLink: Omit<QuickLink, "id" | "icon">) => {
    setIsLoading(true);

    // Normalize the URL
    let normalizedUrl = newLink.url;
    if (
      !normalizedUrl.startsWith("http://") &&
      !normalizedUrl.startsWith("https://")
    ) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Generate favicon URL
    // https://www.faviconextractor.com/favicon/zync-v1.onrender.com?larger=true
    console.log(newLink.url.replace(/(^\w+:|^)\/\//, ""));
    const faviconUrl = `https://www.faviconextractor.com/favicon/${newLink.url.replace(
      /(^\w+:|^)\/\//,
      ""
    )}?larger=true`;

    // Create the link object
    const linkToAdd: QuickLink = {
      id: Date.now().toString(),
      title: newLink.title || new URL(normalizedUrl).hostname,
      url: normalizedUrl,
      icon: faviconUrl,
    };

    // Add the link immediately
    setLinks((prevLinks) => [...prevLinks, linkToAdd]);
    setIsAddingLink(false);
    setIsLoading(false);

    // Validate URL in background
    if (urlValidatorWorker) {
      urlValidatorWorker.postMessage(normalizedUrl);
      urlValidatorWorker.onmessage = (event) => {
        if (!event.data.valid) {
          // If URL is invalid, remove it from the list
          setLinks((prevLinks) =>
            prevLinks.filter((link) => link.id !== linkToAdd.id)
          );
          // Optionally, show an error message to the user
          console.error("Invalid URL:", normalizedUrl);
        }
      };
    }
  }, []);

  const editLink = useCallback((updatedLink: QuickLink) => {
    setLinks((prevLinks) =>
      prevLinks.map((link) => (link.id === updatedLink.id ? updatedLink : link))
    );
    setEditingLink(null);
  }, []);

  const handleLinkClick = (link: QuickLink) => {
    if (activeMenu === link.id) {
      setActiveMenu(null);
    } else if (activeMenu === null) {
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleLongPress = (link: QuickLink) => {
    setActiveMenu(link.id);
    setIsLongPress(true);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleTouchStart = (link: QuickLink) => {
    longPressTimer.current = setTimeout(() => handleLongPress(link), 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setIsLongPress(false);
  };

  const handleTouchMove = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleEditClick = useCallback(
    (e: React.MouseEvent, linkToEdit: QuickLink) => {
      e.stopPropagation();
      setEditingLink(linkToEdit);
      setActiveMenu(null);
    },
    []
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent, linkId: string) => {
      e.stopPropagation();
      setLinks((prevLinks) => prevLinks.filter((link) => link.id !== linkId));
      setActiveMenu(null);
    },
    []
  );
  return (
    <div className="mt-4 py-3 px-2 w-full quick-link rounded-xl">
      <div className="flex flex-row items-center overflow-x-auto space-x-2 no-scrollbar">
        {links.map((link) => (
          <div
            key={link.id}
            className="relative flex-shrink-0"
            onTouchStart={() => handleTouchStart(link)}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onClick={() => handleLinkClick(link)}
          >
            <div
              className={`flex flex-col items-center justify-center rounded-full gap-3 w-[3.5rem] h-[3.5rem] transition-all  duration-200 ${
                activeMenu === link.id
                  ? "scale-125 shadow-lg bg-accent/50"
                  : "quick-link-item"
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                {link.icon.startsWith("http") ? (
                  <img
                    src={link.icon}
                    alt={link.title}
                    className="w-9 h-9 object-contain"
                    onError={(error) => console.log(error)}
                  />
                ) : (
                  <div className="w-9 h-9 bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                    {link.icon}
                  </div>
                )}
              </div>
            </div>
            {activeMenu === link.id && (
              <div
                id={`quick-link-${link.id}`}
                className="absolute inset-x-0 bottom-0 flex items-center justify-center z-10 animate-slide-up"
                style={{
                  width: "190px",
                }}
              >
                <div className="flex space-x-2 p-2 bg-background/80 backdrop-blur-sm rounded-full shadow-lg">
                  <button
                    onClick={(e) => handleEditClick(e, link)}
                    className="p-4 bg-accent rounded-full"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, link.id)}
                    className="p-4 bg-destructive text-destructive-foreground rounded-full"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveMenu(null)}
                    className="p-4 bg-secondary rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {links.length < 12 && (
          <button
            onClick={() => setIsAddingLink(true)}
            className="flex flex-col items-center justify-center w-[3.5rem] h-[3.5rem] quick-link-item text-secondary-foreground rounded-full flex-shrink-0"
          >
            <DashboardSquareAddIcon className="w-6 h-6 text-foreground" />
          </button>
        )}
      </div>
      {isAddingLink && (
        <AddLinkForm
          onSave={addNewLink}
          onCancel={() => setIsAddingLink(false)}
          isLoading={isLoading}
        />
      )}
      {editingLink && (
        <EditLinkForm
          link={editingLink}
          onSave={editLink}
          onCancel={() => setEditingLink(null)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default QuickLinksMobile;
