import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToASCII = (text: string) => {
  // remove non ascii values (from chatgpt ;))
  return text.replace(/[^\x00-\x7F]+/g, "");
};
