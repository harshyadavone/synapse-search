import React, { useState } from "react";
import { Loader, X } from "lucide-react";
import { QuickLink } from "@/components/layout/Quick-Links/QuickLinks";
import { DashboardSquareEditIcon } from "@/components/ui/icons";

interface EditLinkFormProps {
  link: QuickLink;
  onSave: (updatedLink: QuickLink) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const EditLinkForm: React.FC<EditLinkFormProps> = ({
  link,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [editedLink, setEditedLink] = useState(link);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedLink.url) {
      onSave(editedLink);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="bg-card p-6 rounded-xl border border-input shadow-lg max-w-sm md:max-w-md w-full relative">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-md transition-colors duration-100"
          aria-label="Close"
        >
          <X size={22} />
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start justify-start">
            <div className="bg-primary/10 rounded-xl p-3">
              <DashboardSquareEditIcon className="text-primary" />
            </div>
            <h3 className="text-xl font-medium p-3 text-secondary-foreground/70">
              Edit Shortcut
            </h3>
          </div>
          <div className="border-b rounded-xl" />
          <input
            type="text"
            placeholder="Title (optional)"
            value={editedLink.title}
            onChange={(e) =>
              setEditedLink({ ...editedLink, title: e.target.value })
            }
            className="w-full p-2 dark:bg-[#292a29] text-foreground rounded-xl border
            focus:outline-none focus:border-foreground/30 placeholder:pl-1.5"
          />
          <input
            type="text"
            placeholder="https://www.google.com"
            value={editedLink.url}
            onChange={(e) =>
              setEditedLink({ ...editedLink, url: e.target.value })
            }
            className="w-full p-2 dark:bg-[#292a29] text-foreground rounded-xl border
            focus:outline-none focus:border-foreground/30 placeholder:pl-1.5"
            required
          />
          <div className="flex w-full space-x-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-full px-3 py-3 text-sm text-foreground rounded-xl bg-secondary/90 hover:bg-secondary/60 transition-colors duration-200 font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full px-3 py-3 text-sm bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center font-medium"
              disabled={isLoading || !editedLink.url}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin mr-1" size={14} />
                  Saving...
                </>
              ) : (
                <p className="font-medium">Save Changes</p>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLinkForm;
