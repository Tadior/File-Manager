// const readline = require("node:readline");
import readline from "readline";
import { resolve, dirname } from "path";
import path from "path";
import * as fs from "fs";
import * as fsPromise from "fs/promises";
import { readdir } from "node:fs";
import { checkExist } from "./helpers/checkExist.js";
import { stdin, stdout } from "node:process";
import { getDirname } from "./helpers/getDirname.js";
const input = stdin;
const output = stdout;
import { pipeline } from "node:stream/promises";
import { unlink } from "node:fs/promises";

// const path = require("node:path");
// const fs = require("fs");
// const fsPromise = require("fs").promises;

const regExp = /--username=/g;
const userArgv = process.argv.filter((arg) => {
  if (arg.match(regExp)) {
    return arg;
  }
});
const userData = userArgv[0].split("--username=");
const userName = userData[1];

// const { stdin: input, stdout: output } = require("node:process");
// const { readdir } = require("node:fs");
// const { resolve } = require("node:path");
// const { checkExist } = require("./helpers/checkExist");
const rl = readline.createInterface({ input, output });

const greetingMessage = () =>
  console.log(`Welcome to the File Manager, ${userName}!`);
const exitMessage = () =>
  console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
let currentPath = path.join(process.cwd());

greetingMessage();

rl.on("line", async (input) => {
  if (input.trim() === "exit") {
    process.exit();
  }
  if (input.trim() === "up") {
    currentPath = path.join(currentPath, "..");
  }
  if (input.match(/\bcd\b/)) {
    const inputValue = input.split("cd ");
    const newPath = inputValue[1];
    const oldPath = currentPath;
    if (newPath.trim() === "..") {
      currentPath = path.join(currentPath, "..");
    } else {
      currentPath = path.isAbsolute(newPath) ? newPath : oldPath;
    }
    try {
      await fsPromise.access(path.resolve(oldPath, newPath));
      currentPath = path.resolve(oldPath, newPath);
    } catch (error) {
      currentPath = oldPath;
      console.log("Wrong path");
    }
  }
  if (input.trim() === "ls") {
    const dataFiles = [];
    const dataDirectory = [];
    (async () => {
      for (let item of await fsPromise.readdir(currentPath, {
        withFileTypes: true,
      })) {
        if (item.isFile()) {
          dataFiles.push({ file: item.name, type: "file" });
        }
        if (item.isDirectory()) {
          dataDirectory.push({ file: item.name, type: "directory" });
        }
      }
    })().then((data) => {
      const tableData = dataFiles.concat(dataDirectory);
      console.table(tableData);
    });
  }
  if (input.match(/\bcat\b/)) {
    const fileName = input.trim().split(" ")[1];
    try {
      const fileData = await fsPromise.readFile(
        path.resolve(currentPath, fileName),
        { encoding: "utf8" }
      );
      console.log(fileData);
    } catch (error) {
      console.log("wrong file");
    }
  }
  if (input.match(/\badd\b/)) {
    const fileName = input.split(" ")[1];
    try {
      fsPromise.appendFile(fileName, "");
    } catch (error) {
      console.log("creating file failed");
    }
  }
  if (input.match(/\brn\b/)) {
    const oldPath = input.trim().split(" ")[1];
    const newFileName = input.trim().split(" ")[2];
    try {
      fsPromise.rename(
        oldPath,
        path.resolve(path.dirname(oldPath), newFileName)
      );
    } catch (error) {
      console.log("renaming was failed");
    }
  }
  if (input.match(/\bcp\b/)) {
    const oldPath = input.trim().split(" ")[1];
    let newPathValue = input.trim().split(" ")[2];
    const newPath = path.isAbsolute(newPathValue)
      ? newPathValue
      : path.resolve(currentPath, newPathValue);
    const fileName = path.basename(oldPath);
    const readStream = fs.createReadStream(oldPath);
    const writeStream = fs.createWriteStream(path.join(newPath, fileName));
    readStream.on("start", () => {
      fsPromise.appendFile(path.join(newPath, fileName), "");
    });
    readStream.on("data", (chunk) => {
      writeStream.write(chunk);
    });
    readStream.on("end", () => {
      writeStream.end();
    });
    readStream.on("error", (error) => {
      console.log(error);
    });
  }
  if (input.match(/\bmv\b/)) {
    try {
      const pathToFile = resolve(input.trim().split(" ")[1]);
      const fileName = path.basename(pathToFile);
      const pathToDest = resolve(input.trim().split(" ")[2], fileName);
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
  }
  if (input.match(/\brm\b/)) {
    const pathValue = input.trim().split(" ")[1];
    const pathToFile = path.isAbsolute(pathValue)
      ? pathValue
      : path.join(currentPath, pathValue);
    try {
      await fsPromise.rm(pathToFile);
    } catch (error) {
      console.log("no such a file");
    }
  }
  console.log(`You are currently in ${currentPath}`);
});
process.on("exit", () => {
  exitMessage();
});
