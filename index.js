const readline = require("node:readline");

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

greetingMessage();

rl.on("line", (input) => {
  console.log(`You are currently in ${__dirname}`);
  if (input.trim() === "exit") {
    process.exit();
  }
});
process.on("exit", () => {
  exitMessage();
});

// rl.question("What do you think of Node.js? ", (answer) => {
//   // TODO: Log the answer in a database
//   console.log(`Thank you for your valuable feedback: ${answer}`);

//   rl.close();
// });
