import * as osNode from "os";

export const os = async (parameters) => {
  switch (parameters[0]) {
    case "--EOL": {
      process.stdout.write(`${JSON.stringify(osNode.EOL)}\n`);
      break;
    }
    case "--cpus": {
      console.log(osNode.cpus());
      break;
    }
    case "--homedir": {
      console.log(osNode.homedir());
      break;
    }
    case "--username": {
      console.log(osNode.userInfo().username);
      break;
    }
    case "--architecture": {
      console.log(osNode.arch());
      break;
    }
  }
};
