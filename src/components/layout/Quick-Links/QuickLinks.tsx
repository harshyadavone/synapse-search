"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import QuickLinkActions from "./QuickLinkActions";
import EditLinkForm from "@/components/shared/forms/EditLinkForm";
import AddLinkForm from "@/components/shared/forms/AddLinkForm";
import { DashboardSquareAddIcon } from "@/components/ui/icons";

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon: string;
}

let urlValidatorWorker: Worker | null = null;

const QuickLinks: React.FC = () => {
  const [links, setLinks] = useState<QuickLink[]>(() => {
    if (typeof window !== "undefined") {
      // Check for browser environment
      const savedLinks = localStorage.getItem("quickLinks");
      return savedLinks ? JSON.parse(savedLinks) : [];
    } else {
      return []; // Return an empty array if not in browser
    }
  });

  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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
    const savedLinks = localStorage.getItem("quickLinks");
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("quickLinks", JSON.stringify(links));
  }, [links]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: any) => {
    setIsDragging(false);
    const { active, over } = event;

    if (active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleMouseEnter = (id: string) => {
    if (!isDragging) {
      setHoveredLinkId(id);
    }
  };

  const handleMouseLeave = () => {
    setHoveredLinkId(null);
  };

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

  const deleteLink = useCallback((linkId: string) => {
    setLinks((prevLinks) => prevLinks.filter((link) => link.id !== linkId));
  }, []);

  const handleEditClick = useCallback((linkToEdit: QuickLink) => {
    setEditingLink(linkToEdit);
  }, []);

  return (
    <div className="mt-8 py-6 px-2 rounded-lg ">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={links} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-5 md:grid-cols-6 gap-4">
            {links.map((link) => (
              <div
                key={link.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(link.id)}
                onMouseLeave={handleMouseLeave}
              >
                <SortableItem link={link} />
                <QuickLinkActions
                  link={link}
                  onEdit={handleEditClick}
                  onDelete={deleteLink}
                  isHovered={hoveredLinkId === link.id}
                  isDragging={isDragging}
                />
              </div>
            ))}
            {links.length < 12 && (
              <button
                onClick={() => setIsAddingLink(true)}
                className="flex flex-col items-center justify-center bg-muted  dark:bg-secondary/10 text-secondary-foreground p-2 py-2 md:py-0 w-full rounded-full md:rounded-lg hover:bg-secondary/50 dark:hover:bg-secondary/20 transition-colors duration-200 aspect-square h-full"
              >
                <DashboardSquareAddIcon className=" size-8 text-foreground/80" />
              </button>
            )}
          </div>
        </SortableContext>
      </DndContext>
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

export default QuickLinks;
