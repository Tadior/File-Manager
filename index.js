import readline from "readline";
import path from "path";
import { stdin, stdout } from "node:process";
import { add } from "./fs/add.js";
import { cat } from "./fs/cat.js";
import { rn } from "./fs/rn.js";
import { cp } from "./fs/cp.js";
import { mv } from "./fs/mv.js";
import { rm } from "./fs/rm.js";
import { ls } from "./ls/ls.js";
import { os } from "./os/os.js";
import { hash } from "./hash/hash.js";

const fileManager = async () => {
  const input = stdin;
  const output = stdout;

  const regExp = /--username=/g;
  const userArgv = process.argv.filter((arg) => {
    if (arg.match(regExp)) {
      return arg;
    }
  });
  const userData = userArgv[0].split("--username=");
  const userName = userData[1];
  const rl = readline.createInterface({ input, output });

  const greetingMessage = () =>
    process.stdout.write(`Welcome to the File Manager, ${userName}!\n`);
  const exitMessage = () =>
    process.stdout.write(
      `Thank you for using File Manager, ${userName}, goodbye!\n`
    );

  greetingMessage();

  rl.on("line", async (input) => {
    const inputArr = input.split(" ").filter((element) => element.trim());
    const command = inputArr[0];
    const parameters = inputArr.slice(1);
    switch (command) {
      case "exit": {
        if (parameters.length === 0) {
          process.exit();
        } else {
          process.stdout.write(`Invalid input\n`);
        }
        break;
      }
      case "up": {
        if (parameters.length === 0) {
          process.chdir("..");
        } else {
          process.stdout.write(`Invalid input\n`);
        }
        break;
      }
      case "cd": {
        if (parameters.length === 1) {
          try {
            process.chdir(parameters[0]);
          } catch (error) {
            console.log("Operation failed");
          }
        } else {
          process.stdout.write(`Invalid input\n`);
        }
        break;
      }
      case "ls": {
        if (parameters.length === 0) {
          await ls().then((data) => {
            const tableData = data[0].concat(data[1]);
            console.table(tableData);
          });
        } else {
          process.stdout.write(`Invalid input\n`);
        }
        break;
      }
      case "cat": {
        if (parameters.length === 1) {
          cat(parameters).then((result) => {
            process.stdout.write(result);
          });
        } else {
          process.stdout.write(`Invalid input\n`);
        }
        break;
      }
      case "add": {
        if (parameters.length === 1) {
          await add(parameters).then((result) => {
            process.stdout.write(result);
          });
        } else {
          process.stdout.write(`Invalid input\n`);
        }
        break;
      }
      case "rn": {
        if (parameters.length === 2) {
          await rn(parameters);
        } else {
          process.stdout.write(`Invalid input\n`);
        }
        break;
      }
      case "cp": {
        if (parameters.length === 2) {
          await cp(parameters);
        } else {
          process.stdout.write(`Invalid input\n`);
        }
        break;
      }
      case "mv": {
        if (parameters.length === 2) {
          await mv(parameters);
        } else {
          process.stdout.write(`Invalid input\n`);
        }
        break;
      }
      case "rm": {
        if (parameters.length === 1) {
          await rm(parameters);
        } else {
          process.stdout.write(`Invalid input\n`);
        }
        break;
      }
      case "os": {
        if (parameters.length === 1 && typeof parameters !== "undefined") {
          if (parameters[0].startsWith("--")) {
            await os(parameters);
          } else {
            process.stdout.write(`Invalid input\n`);
          }
        } else {
          process.stdout.write(`Invalid input\n`);
        }
        break;
      }
      case "hash": {
        if (parameters.length === 1) {
          await hash(parameters).then((result) => {
            process.stdout.write(result);
          });
        } else {
          process.stdout.write(`Invalid input\n`);
        }
        break;
      }
      case "example": {
        if (parameters.length === 1) {
        } else {
          process.stdout.write(`Invalid input\n`);
        }
        break;
      }
    }

    console.log(`You are currently in ${process.cwd()}`);
  });
  process.on("exit", () => {
    exitMessage();
  });
};
await fileManager();
