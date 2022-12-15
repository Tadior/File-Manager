import { resolve } from "node:path";
import { createWriteStream } from "node:fs";

export const add = async (fileName) => {
  const pathToNewFile = resolve(process.cwd(), fileName[0]);
  const writeStream = createWriteStream(pathToNewFile, { flags: "wx" });
  return new Promise((resolve) => {
    writeStream.on("finish", () => {
      resolve("File was created\n");
    });
    writeStream.on("error", () => {
      resolve("Operation failed!\n");
    });
    writeStream.end();
  });
};
