import fs from 'node:fs';
import path from 'node:path';

const tagretPath = path.resolve(import.meta.dirname, 'text.txt');
const readableStream = fs.createReadStream(tagretPath, 'utf8');

readableStream.pipe(process.stdout);
