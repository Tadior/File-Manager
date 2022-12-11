import { createWriteStream, createReadStream } from "node:fs";
import { sep, resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import { checkExist } from "../helpers/checkExist.js";

export const cp = async (parameters) => {
  try {
    const pathToFile = resolve(parameters[0]);
    let pathToNewDirectory = parameters[1];
    const sourcePath = pathToFile.split(sep).pop();
    pathToNewDirectory = resolve(pathToNewDirectory, sourcePath);
    const isSourceFileExists = await checkExist(pathToFile);
    if (!isSourceFileExists) {
      console.log("There is no file in directory!");
      console.log("Operation failed!");
      return;
    }
    const readStream = createReadStream(pathToFile);
    const writeStream = createWriteStream(pathToNewDirectory);
    await pipeline(readStream, writeStream);
  } catch (error) {
    console.log("Operation failed!");
  }
};
