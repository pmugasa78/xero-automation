import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const waitForElement = async (
  selector: string,
  timeout = 5000
): Promise<Element | null> => {
  const pollInterval = 100;
  let elapsed = 0;

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
      } else if (elapsed >= timeout) {
        clearInterval(interval);
        resolve(null);
      }
      elapsed += pollInterval;
    }, pollInterval);
  });
};

export function groupByName(arr: any) {
  const grouped = arr.reduce((accumulator: any, currentItem: any) => {
    const name = currentItem.Name.split("-")[0].trim();

    // If the category doesn't exist as a key in the accumulator, create it
    if (!accumulator[name]) {
      accumulator[name] = [];
    }

    // Push the current item into the array for that category
    accumulator[name].push(currentItem);

    // Return the accumulator for the next iteration
    return accumulator;
  }, {});
  return grouped;
}

export function getTargetUrl(currentUrl: string) {
  const urlObj = new URL(currentUrl);
  const path = urlObj.pathname.replace("/Run/", "/Run/GetData/");
  const targetUrl = `https://reporting.xero.com${path}`;
  return targetUrl;
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
