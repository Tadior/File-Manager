import * as fs from "node:fs";

const checkExist = (path) => {
  return new Promise((resolve) => {
    fs.access(path, fs.constants.F_OK, (error) => {
      if (!error) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

export { checkExist };
