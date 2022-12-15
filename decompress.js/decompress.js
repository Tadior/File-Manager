import path, { resolve } from "path";
import { checkExist } from "../helpers/checkExist.js";
import fs from "fs";
import zlib from "zlib";
import { pipeline } from "node:stream/promises";

export const decompress = async (parametrs) => {
  try {
    const pathToFile = resolve(parametrs[0]);
    const fileName = path.basename(pathToFile).replace(".br", "");
    const pathToDest = resolve(parametrs[1], fileName);
    const isFileNameExists = await checkExist(pathToFile);
    if (!isFileNameExists || !path.basename(pathToFile).includes(".br")) {
      console.log("There is no file in directory!");
      return;
    }
    const readStream = fs.createReadStream(pathToFile, { flags: "r" });
    const writeStream = fs.createWriteStream(pathToDest, { flags: "w" });
    const brotli = zlib.createBrotliDecompress();
    await pipeline(readStream, brotli, writeStream);
  } catch (error) {
    console.log("Operation failed!");
  }
};
