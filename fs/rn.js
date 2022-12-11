import * as fs from "node:fs/promises";
import { sep, join } from "node:path";
import { resolve } from "node:path";

export const rn = async (parameters) => {
  try {
    const pathToFile = resolve(parameters[0]);
    const newFileName = parameters[1];
    const dirSourceFile = pathToFile.split(sep);
    dirSourceFile.pop();
    const dir = join(...dirSourceFile);
    const pathToNewFile = resolve(dir, newFileName);
    await fs.rename(pathToFile, pathToNewFile);
  } catch (error) {
    console.log("Operation failed!");
  }
};
