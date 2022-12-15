import * as fsPromise from "fs/promises";

export const ls = async () => {
  const dataFiles = [];
  const dataDirectory = [];
  for (let item of await fsPromise.readdir(process.cwd(), {
    withFileTypes: true,
  })) {
    if (item.isFile()) {
      dataFiles.push({ name: item.name, type: "file" });
    }
    if (item.isDirectory()) {
      dataDirectory.push({ name: item.name, type: "directory" });
    }
  }
  return await [dataFiles, dataDirectory];
};
