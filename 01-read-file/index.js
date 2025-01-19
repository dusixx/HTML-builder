const fs = require('fs');
const path = require('path');

const tagretPath = path.resolve(__dirname, 'text.txt');
const readableStream = fs.createReadStream(tagretPath, 'utf8');

readableStream.pipe(process.stdout);
