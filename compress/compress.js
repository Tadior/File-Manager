import zlib from "zlib";
import { resolve } from "path";
import fs from "fs";
import path from "path";
import { checkExist } from "../helpers/checkExist.js";
import { pipeline } from "node:stream/promises";

export const compress = async (parameters) => {
  const pathToFile = resolve(parameters[0]);
  const fileName = path.basename(pathToFile);
  const pathToDest = resolve(parameters[1], fileName);
  const isFileNameExists = await checkExist(pathToFile);
  if (!isFileNameExists) {
    console.log("There is no file in directory!");
    return;
  }
  try {
    const readStream = fs.createReadStream(pathToFile, {
      flags: "r",
      encoding: "utf8",
    });
    const writeStream = fs.createWriteStream(`${pathToDest}`, { flags: "wx" });
    const brotli = zlib.createBrotliCompress();
    await pipeline(readStream, brotli, writeStream);
  } catch (error) {
    console.log("Operation failed!");
  }
};
