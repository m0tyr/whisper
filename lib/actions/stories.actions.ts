"use server";
import path from "path";
import fs from "fs";

export default async function getFeaturedStickers() {
  const directoryPath = path.join(process.cwd(), "public/imgs");
  let output;
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return { error: "Failed to read directory" };
    }

    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    const imagePaths = imageFiles.map((file) => `/imgs/${file}`);
    
  });
  return ["/test/Test.png"];
}