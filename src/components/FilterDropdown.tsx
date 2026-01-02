"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterDropdownProps {
  placeholder: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function FilterDropdown({
  placeholder,
  options,
  value,
  onChange,
  className = "",
}: FilterDropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`h-12 md:h-16 border-orange-500 text-base md:text-xl font-bold ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
