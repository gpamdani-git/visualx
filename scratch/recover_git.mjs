import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const targetFile = 'src/registry/hudbirdDocsTemplates.ts';
const repoDir = process.cwd();
const indexPath = path.join(repoDir, '.git', 'index');

const data = fs.readFileSync(indexPath);
const targetBytes = Buffer.from(targetFile, 'utf-8');

let idx = data.indexOf(targetBytes);
if (idx === -1) {
  console.log("File not found in index");
  process.exit(1);
}

const shaOffset = idx - 22;
const shaBytes = data.subarray(shaOffset, shaOffset + 20);
const shaHex = shaBytes.toString('hex');

console.log("Found SHA:", shaHex);

const objPath = path.join(repoDir, '.git', 'objects', shaHex.substring(0, 2), shaHex.substring(2));

if (!fs.existsSync(objPath)) {
  console.log("Object does not exist at", objPath);
  process.exit(1);
}

const compressed = fs.readFileSync(objPath);
const uncompressed = zlib.unzipSync(compressed);

const nullIdx = uncompressed.indexOf(0);
const content = uncompressed.subarray(nullIdx + 1).toString('utf-8');

fs.writeFileSync('scratch/original_ast.ts', content);
console.log("Recovered original file to scratch/original_ast.ts");
