import fs from "fs";
import { resolve } from "node:path";
import path from "path";
import { pipeline } from "node:stream/promises";
import { unlink } from "node:fs/promises";
import { checkExist } from "../helpers/checkExist.js";

export const mv = async (parameters) => {
  try {
    const pathToFile = resolve(parameters[0]);
    const fileName = path.basename(pathToFile);
    const pathToDest = resolve(parameters[1], fileName);
    const isFileNameExists = await checkExist(pathToFile);
    if (!isFileNameExists) {
      console.log("There is no file in directory!");
      return;
    }
    const readStream = fs.createReadStream(pathToFile, { flags: "r" });
    const writeStream = fs.createWriteStream(pathToDest, { flags: "wx" });
    await pipeline(readStream, writeStream);
    await unlink(pathToFile);
  } catch (error) {
    console.log("Operation failed!");
  }
};
