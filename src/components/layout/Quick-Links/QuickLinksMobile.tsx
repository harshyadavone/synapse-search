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
    // console.log(newLink.url.replace(/(^\w+:|^)\/\//, ""));
    const faviconUrl = `https://www.faviconextractor.com/favicon/${newLink.url.replace(
      /(^\w+:|^)\/\//,
      ""
    )}?larger=true`;

    // Create the link object
    const linkToAdd: QuickLink = {
      id: Date.now().toString(),
      title: newLink.title || normalizedUrl.split("/")[2].split(".")[0],
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
    <div className="w-full quick-link">
      <div className="grid grid-cols-2 gap-1">
        {links.map((link, index) => {
          // Determine if the current item is the last item in its row
          const isLastRowSingleItem =
            links.length % 2 !== 0 && index === links.length - 1;
          const isLeftLastItem =
            links.length % 2 === 0 && index === links.length - 2;
          const isRightLastItem =
            links.length % 2 === 0 && index === links.length - 1;

          return (
            <div
              key={link.id}
              className="relative"
              onTouchStart={() => handleTouchStart(link)}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              onClick={() => handleLinkClick(link)}
              onContextMenu={(e) => e.preventDefault()} // Prevent the context menu
            >
              <div
                className={`flex flex-row gap-3 items-center justify-centers transition-all p-4 truncate border duration-200 ${
                  activeMenu === link.id
                    ? "scale-105 border border-border rounded-lg shadow-lg bg-accent/50"
                    : "bg-muted/40 border-transparent"
                } ${
                  // Dynamically apply rounded corners based on index and total length
                  (index === 0 && "rounded-tl-xl") ||
                  (index === 1 && "rounded-tr-xl") ||
                  (isLeftLastItem && "rounded-bl-lg") ||
                  (isRightLastItem && "rounded-br-lg") ||
                  (isLastRowSingleItem && "rounded-bl-lg")
                }`}
              >
                <img
                  src={link.icon}
                  alt={link.title}
                  className="w-8 h-8 object-contain"
                  onError={(error) => console.log(error)}
                />
                <div className="flex flex-col gap-1 truncate">
                  <p className="text-sm truncate capitalize">{link.title}</p>
                  <p className="text-xs text-foreground/70 truncate mr-1">
                    {link.url.split("https://")[1]}
                  </p>
                </div>
              </div>

              {activeMenu === link.id && (
                <div
                  id={`quick-link-${link.id}`}
                  className="absolute inset-x-0 bottom-1 flex items-center justify-center z-10 animate-slide-up"
                  style={{
                    width: "190px",
                  }}
                >
                  <div className="flex space-x-2 p-2 bg-background/80 backdrop-blur-lg rounded-lg shadow-lg">
                    <button
                      onClick={(e) => handleEditClick(e, link)}
                      className="p-4 bg-accent rounded-lg border border-border"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, link.id)}
                      className="p-4 bg-destructive text-destructive-foreground rounded-lg border border-border"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveMenu(null)}
                      className="p-4 bg-secondary rounded-lg border border-border"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {links.length < 12 && (
          <button
            onClick={() => setIsAddingLink(true)}
            className={`flex gap-2 items-center justify-center p-4 py-5 text-secondary-foreground bg-muted/40 flex-shrink-0 active:scale-[0.97] transition-all duration-200 ${
              links.length % 2 === 0
                ? "rounded-bl-lg rounded-br-lg"
                : "rounded-br-lg"
            }`}
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
