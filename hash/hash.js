import crypto from "crypto";
import fs from "fs";

export const hash = async (parameters) => {
  const readStream = fs.createReadStream(parameters[0], {
    flags: "r",
    encoding: "utf8",
  });
  let data = "";
  return new Promise((resolve) => {
    readStream.on("data", (chunk) => {
      data += chunk;
    });
    readStream.on("end", () => {
      const hashSum = crypto.createHash("sha256");
      hashSum.update(data);
      const hex = hashSum.digest("hex");
      resolve(`${hex}\n`);
    });
    readStream.on("error", (error) => {
      resolve("Operation failed!\n");
    });
  });
};
