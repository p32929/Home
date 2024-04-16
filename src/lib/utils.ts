import { Constants } from "@/lib/Constants";
import { IData, IUrlButton } from "@/lib/Models";
import { controller } from "@/lib/StatesController";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getValueAtIndex = (arr: any[], index: number): any | undefined => {
  const length = arr.length;

  // Normalize negative indices
  if (index < 0) {
    index += length;
  }

  // Check if the index is within bounds
  if (index >= 0 && index < length) {
    return arr[index];
  } else {
    return undefined; // Out of bounds
  }
}

export const scrollToView = (id: string) => {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
  });
  console.log(`Scrolled`);
};

export const setSavedData = async (data?: IData) => {
  try {
    if (data === undefined) {
      data = JSON.parse(localStorage.getItem(Constants.STORAGE) ?? "[]") as IData;
    }
    controller.setState({
      data: data,
      isImportDialogOpen: false,
    });
  } catch (e) {
    // Handle error
  }
}

export function getHostFromURL(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    console.error("Invalid URL:", url);
    return "";
  }
}

export function getImgUrl(item?: IUrlButton) {
  if (item == undefined) return ""

  // const imgUrl = `https://sporting-ivory-emu.faviconkit.com/${getHostFromURL(item.link)}/64`
  const imgUrl = `https://favicon.yandex.net/favicon/${getHostFromURL(item.link)}?size=32`
  return imgUrl
}

export function isColorCodeOrLink(value: string): boolean {
  // Regular expression patterns for color code and URL
  const colorCodePattern = /^#[0-9A-F]{6}$/i; // Matches # followed by six hexadecimal characters
  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/; // Matches URLs starting with ftp, http, or https

  // Check if the value matches either pattern
  return colorCodePattern.test(value) || urlPattern.test(value);
}
