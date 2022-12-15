import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const getDirname = async (url) => {
  return new Promise((resolve) => {
    const __filename = fileURLToPath(url);
    const __dirname = dirname(__filename);
    resolve(__dirname);
  });
};
