"use client";
import React, { useState, useEffect, useRef } from "react";
import { Switch } from "@/components/ui/Switch";
import { UserPreferences } from "@/app/page";

interface CustomizeModalProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  onClose: () => void;
}

const PreferenceItem: React.FC<{
  name: keyof UserPreferences;
  label: string;
  checked: boolean;
  onChange: (name: keyof UserPreferences, checked: boolean) => void;
}> = ({ name, label, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-foreground/10 last:border-b-0">
    <label
      htmlFor={name}
      className="text-sm font-medium text-foreground/80 cursor-pointer"
    >
      {label}
    </label>
    <Switch
      // id={name}
      checked={checked}
      onChange={(checked) => onChange(name, checked)}
    />
  </div>
);

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  preferences,
  onSave,
  onClose,
}) => {
  const [localPreferences, setLocalPreferences] =
    useState<UserPreferences>(preferences);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleChange = (name: keyof UserPreferences, checked: boolean) => {
    setLocalPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-card p-6 rounded-xl border border-input shadow-lg max-w-sm md:max-w-md w-full relative"
        ref={modalRef}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <h2
          id="modal-title"
          className="text-2xl mb-3 font-bold text-foreground"
        >
          Customize Homepage
        </h2>
        <div className="border-b rounded-xl  mb-3" />
        <div className="space-y-2">
          <PreferenceItem
            name="showWeather"
            label="Show Weather"
            checked={localPreferences.showWeather}
            onChange={handleChange}
          />
          <PreferenceItem
            name="showQuickLinks"
            label="Show Quick Links"
            checked={localPreferences.showQuickLinks}
            onChange={handleChange}
          />
          <PreferenceItem
            name="showLogo"
            label="Show Logo"
            checked={localPreferences.showLogo}
            onChange={handleChange}
          />
          {/* <PreferenceItem
            name="showQuickAccess"
            label="Show Quick Access"
            checked={localPreferences.showQuickAccess}
            onChange={handleChange}
          /> */}
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-foreground/80 bg-accent hover:bg-accent/80 rounded-md focus:outline-none focus:ring-1  focus:ring-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(localPreferences)}
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-white transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
