import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: Date | null) {
  if (date === null) {
    return "";
  }

  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}
