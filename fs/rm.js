import { resolve } from "node:path";
import { unlink } from "node:fs/promises";

export const rm = async (parameters) => {
  try {
    const pathToFile = resolve(parameters[0]);
    await unlink(pathToFile);
  } catch (error) {
    console.log("Operation failed!");
  }
};
