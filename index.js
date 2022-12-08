const readline = require("node:readline");
const path = require("node:path");
const fs = require("fs");
const fsPromise = require("fs").promises;

const regExp = /--username=/g;
const userArgv = process.argv.filter((arg) => {
  if (arg.match(regExp)) {
    return arg;
  }
});
const userData = userArgv[0].split("--username=");
const userName = userData[1];

const { stdin: input, stdout: output } = require("node:process");
const rl = readline.createInterface({ input, output });

const greetingMessage = () =>
  console.log(`Welcome to the File Manager, ${userName}!`);
const exitMessage = () =>
  console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
let currentPath = path.join(__dirname);

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
      await fsPromise.access(currentPath);
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
  console.log(`You are currently in ${currentPath}`);
});
process.on("exit", () => {
  exitMessage();
});
