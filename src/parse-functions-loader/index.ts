import fs from 'fs';
import path from 'path';

export function loadParseFunctions(dir: string): any {
  const files = fs.readdirSync(dir);
  const parseFunctions = {};
  for (const file of files) {
    console.log(file);
    // const filePath = path.join(dir, file);
    // const fileName = path.basename(filePath, '.ts');
    // parseFunctions[fileName] = require(filePath);
  }
  return parseFunctions;
}

