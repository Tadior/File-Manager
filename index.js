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
const { readdir } = require("node:fs");
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
    const pathToFile = input.trim().split(" ")[1];
    const fileName = path.basename(pathToFile);
    const newPathValue = input.trim().split(" ")[2];
    const newPath = path.isAbsolute(newPathValue)
      ? newPathValue
      : path.join(currentPath, newPathValue);
    const readStream = fs.createReadStream(pathToFile);
    readStream
      .on("error", (error) => {
        console.log("------------------------");
        console.log(error.message);
        readStream.destroy();
      })
      .on("data", (chunk) => {
        const writeStream = fs.createWriteStream(path.join(newPath, fileName));
        writeStream.on("error", (error) => {
          if (error && error.message) {
            console.log(error.message);
          }
          readStream.destroy();
          writeStream.end();
        });
        writeStream.write(chunk);
      })
      .on("end", () => {
        console.log("ended");
        try {
          fsPromise.rm(pathToFile);
        } catch (error) {
          console.log(error);
        }
      })
      .on("close", (error) => {
        console.log("destroy");
      });
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
