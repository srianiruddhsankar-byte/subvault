"use client";

import { useState, useRef, useEffect } from "react";
import { searchServices, KnownService } from "@/lib/search-services";

type ServiceAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onSelect: (service: KnownService) => void;
};

export default function ServiceAutocomplete({
  value,
  onChange,
  onSelect,
}: ServiceAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Derived directly from `value` on every render — no useEffect needed,
  // since this isn't syncing with anything external (no API, no subscription).
  const results = searchServices(value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(service: KnownService) {
    onSelect(service);
    setIsOpen(false);
  }

  function handleChange(newValue: string) {
    onChange(newValue);
    setHighlightedIndex(0);
    setIsOpen(searchServices(newValue).length > 0);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      // A suggestion is showing — select it instead of letting the
      // browser submit the whole form on Enter.
      e.preventDefault();
      handleSelect(results[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        placeholder="e.g. Netflix, Spotify..."
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
        autoComplete="off"
      />

      {isOpen && (
        <ul
          className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto
                     rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {results.map((service, index) => (
            <li key={service.name}>
              <button
                type="button"
                onClick={() => handleSelect(service)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
                  index === highlightedIndex ? "bg-gray-50" : ""
                }`}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center
                             rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: service.color }}
                >
                  {service.initial}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-[#1E3A5F]">
                    {service.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {service.category}
                    {service.avgPrice > 0 && ` · ~₹${service.avgPrice}/mo`}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}