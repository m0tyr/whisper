import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}
export function getMeta(url :string, cb:any){
  const img = new Image();
  img.onload = () => cb(null, img);
  img.onerror = (err) => cb(err);
  img.src = url;
};

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


export function calculateTimeAgo(createdAtString : string) {
  const createdAt = new Date(createdAtString) ;
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
      timeAgo = `${yearsDiff} an${yearsDiff > 1 ? '' : ''}`;
  } else if (monthsDiff > 0) {
      timeAgo = `${monthsDiff} mois${monthsDiff > 1 ? '' : ''}`;
  } else if (weeksDiff > 0) {
      timeAgo = `${weeksDiff} sem${weeksDiff > 1 ? '' : ''}`;
  } else if (daysDiff > 0) {
      timeAgo = `${daysDiff} j${daysDiff > 1 ? '' : ''}`;
  } else if (hoursDiff > 0) {
      timeAgo = `${hoursDiff} h${hoursDiff > 1 ? '' : ''}`;
  } else if (minutesDiff > 0) {
      timeAgo = `${minutesDiff} min${minutesDiff > 1 ? '' : ''}`;
  } else {
      timeAgo = 'maintenant';
  }

  return timeAgo;
}



