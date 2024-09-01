import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ExtractedElement,
  Input,
  MediaSize,
  MentionsDatas,
  Root,
} from "./types/whisper.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractMention(json: Root): MentionsDatas[] {
  const extractedData: MentionsDatas[] = [];

  const { children } = json.root;
  children.forEach((paragraph: any) => {
    paragraph.children.forEach((child: any) => {
      if (child.type === "mention") {
        extractedData.push({
          id: child.id || "N/A",
          mention: child.text || "N/A",
        });
      }
    });
  });

  return extractedData;
}

export const getPathPrefix = () => {
  const path = window.location.pathname;
  const parts = path.split("/");
  return "/" + parts[1]; // Retourne le premier segment après le nom de domaine
};

//Media Calculus stuff
//need to test

export function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function getClampedMultipleMediaAspectRatio({
  mediaWidth,
  mediaHeight,
}: MediaSize): number {
  const aspectRatio = mediaWidth / mediaHeight;
  return clamp(aspectRatio, 3 / 4, 4 / 3);
}

export function deriveMultipleMediaHeight(a: number, b: number): number {
  function isThreeFourths(a: number): boolean {
    return Math.abs(a - 3 / 4) < 0.01;
  }

  function isFourThirds(a: number): boolean {
    return Math.abs(a - 4 / 3) < 0.01;
  }

  if (
    (isFourThirds(a) && isFourThirds(b)) ||
    (isThreeFourths(a) && isThreeFourths(b))
  ) {
    return 272;
  } else if (
    (isFourThirds(a) && isThreeFourths(b)) ||
    (isThreeFourths(a) && isFourThirds(b))
  ) {
    return 235;
  } else if (a === 1 && b === 1) {
    return 245;
  } else {
    return 280;
  }
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  return value > max ? max : value;
}
//

export function extractElements(input: Input): ExtractedElement[] {
  const extractedElements: ExtractedElement[] = [];

  // Iterate over each paragraph
  input.root.children.forEach((paragraph) => {
    // Iterate over each element in the paragraph
    paragraph.children.forEach((element) => {
      // If it's a linebreak, set text to '\n'
      const text = element.type === "linebreak" ? "\n" : element.text;

      if (text && element.type) {
        // Extract text and type
        const { type } = element;
        extractedElements.push({ text, type });
      }
    });
  });

  return extractedElements;
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}
export function getMeta(url: string, cb: any) {
  const img = new Image();
  img.onload = () => cb(null, img);
  img.onerror = (err) => cb(err);
  img.src = url;
}
export const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export function processElements(
  elements: ExtractedElement[]
): ExtractedElement[][] {
  let consecutiveLineBreaksCount = 0;
  const sections: ExtractedElement[][] = [];
  let currentSection: ExtractedElement[] = [];

  /* Constraint the final whisper content to contain no more than two linebreak in a row 
     its still a front-end operation done every time we load a whisper this implementation needs to be done
     before posting so that it doesnt compute everytime we load.
  */

  for (const element of elements) {
    if (element.type === "linebreak") {
      consecutiveLineBreaksCount++;
      if (consecutiveLineBreaksCount === 2) {
        sections.push(currentSection);
        currentSection = [];
      }
    } else {
      if (consecutiveLineBreaksCount === 1) {
        currentSection.push({ text: " \n", type: "linebreak" }); // Include a single line break
      }
      currentSection.push(element);
      consecutiveLineBreaksCount = 0; // Reset count when non-line break encountered
    }
  }

  // Push the last section if it's not empty
  if (currentSection.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}
export function limitNewlines(text: string): string {
  const parts = text.split("\n");
  const limitedParts = parts.slice(0, 2); // Take the first two parts

  // Check if there are more than two parts or if the second part is empty
  if (parts.length > 2 || (parts.length === 2 && parts[1] === "")) {
    return limitedParts.join("\n");
  } else {
    // No \n characters found or only one \n character found
    return text;
  }
}
export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

export function formatThreadCount(count: number): string {
  if (count === 0) {
    return "No Threads";
  } else {
    const threadCount = count.toString().padStart(2, "0");
    const threadWord = count === 1 ? "Thread" : "Threads";
    return `${threadCount} ${threadWord}`;
  }
}

export function calculateTimeAgo(createdAtString: string) {
  const createdAt = new Date(createdAtString);
  const current = new Date();

  const timeDifference = current.getTime() - createdAt.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30.44 * day;
  const year = 365.25 * day;

  const yearsDiff = Math.floor(timeDifference / year);
  const monthsDiff = Math.floor(timeDifference / month);
  const weeksDiff = Math.floor(timeDifference / week);
  const daysDiff = Math.floor(timeDifference / day);
  const hoursDiff = Math.floor(timeDifference / hour);
  const minutesDiff = Math.floor(timeDifference / minute);

  let timeAgo;
  if (yearsDiff > 0) {
    timeAgo = `${yearsDiff} an${yearsDiff > 1 ? "" : ""}`;
  } else if (monthsDiff > 0) {
    timeAgo = `${monthsDiff} mois${monthsDiff > 1 ? "" : ""}`;
  } else if (weeksDiff > 0) {
    timeAgo = `${weeksDiff} sem${weeksDiff > 1 ? "" : ""}`;
  } else if (daysDiff > 0) {
    timeAgo = `${daysDiff} j${daysDiff > 1 ? "" : ""}`;
  } else if (hoursDiff > 0) {
    timeAgo = `${hoursDiff} h${hoursDiff > 1 ? "" : ""}`;
  } else if (minutesDiff > 0) {
    timeAgo = `${minutesDiff} min${minutesDiff > 1 ? "" : ""}`;
  } else {
    timeAgo = "maintenant";
  }

  return timeAgo;
}

export function convertToReadableClientData(dataToConvert: any) {
  return JSON.parse(JSON.stringify(dataToConvert));
}
