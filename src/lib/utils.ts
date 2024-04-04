import { IUrlButton } from "@/lib/Models";
import { Server } from "@/lib/Server";
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

export function findColorWithMediumLightness(colors: string[]): string {
  const minLightness = 0.3; // Minimum lightness value for the desired color
  const maxLightness = 0.7; // Maximum lightness value for the desired color

  // Convert color strings to HSL format
  const colorsHSL: { color: string; lightness: number }[] = colors.map((color) => {
    const rgb = parseInt(color.substring(1), 16); // Convert hex to RGB
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lightness = (max + min) / 510; // Normalize lightness to [0, 1]
    return { color, lightness };
  });

  // Find a color with lightness within the desired range
  const mediumLightnessColor = colorsHSL.find(({ lightness }) => lightness >= minLightness && lightness <= maxLightness);

  return mediumLightnessColor ? mediumLightnessColor.color : `#757575`;
}

export function createGlowingEffect(color: string): string {
  // Convert color string to RGB components
  const rgb = parseInt(color.substring(1), 16); // Convert hex to RGB
  let r = (rgb >> 16) & 0xff;
  let g = (rgb >> 8) & 0xff;
  let b = (rgb >> 0) & 0xff;

  // Increase brightness by adding a glow factor
  const glowFactor = 50; // Adjust glow factor as needed
  r = Math.min(r + glowFactor, 255);
  g = Math.min(g + glowFactor, 255);
  b = Math.min(b + glowFactor, 255);

  // Convert RGB components back to color string
  const glowingColor = `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;

  return glowingColor;
}

export function createNeonGlowEffect(color: string): string {
  // Convert color string to RGB components
  const rgb = parseInt(color.substring(1), 16); // Convert hex to RGB
  let r = (rgb >> 16) & 0xff;
  let g = (rgb >> 8) & 0xff;
  let b = (rgb >> 0) & 0xff;

  // Increase brightness by adding a glow factor
  const glowFactor = 50; // Adjust glow factor as needed
  r = Math.min(r + glowFactor, 255);
  g = Math.min(g + glowFactor, 255);
  b = Math.min(b + glowFactor, 255);

  // Add a tint to the color for a neon effect
  const neonTint = 50; // Adjust tint factor as needed
  r = Math.min(r + neonTint, 255);
  g = Math.min(g + neonTint, 255);
  b = Math.min(b + neonTint, 255);

  // Convert RGB components back to color string
  const neonColor = `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;

  return neonColor;
}

export async function getColorFixedUrls(urls: IUrlButton[]) {
  const batchSize = 5; // Adjust batch size based on performance and server limitations
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const promises = batch.map(async (url) => {
      if (!url.colors) {
        try {
          const res = await Server.getDominantColors(`http://www.google.com/s2/favicons?&sz=64&domain=${url.link}`);
          if (!res.error) {
            // console.log(`res.response`, `${url.link} == #${res.response.data[0]}`);
            // Set color property directly on the current URL object
            url.colors = res.response.data
          }
        } catch (error) {
          // console.error('Error occurred while fetching dominant colors:', error);
        }
      }
    });
    await Promise.all(promises);
  }

  // console.log(urls);
  return urls; // Returning the modified urls array
}

