import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** shadcn 標準 classname 合併工具 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
