const fs = require('fs');
const path = require('path');
const readline = require('readline');
const os = require('os');

const { EOL } = os;
const TARGET_FILENAME = 'input.txt';
const FAREWALL_PHRASE = 'Have a good one!\n';

const { stdin: input, stdout: output } = process;
const rl = readline.createInterface({ input, output });

const ws = fs.createWriteStream(path.join(__dirname, TARGET_FILENAME));

console.log(
  `\x1B[2J\nAll input will be saved to a file "${TARGET_FILENAME}"\nType "exit" or press Ctrl+C to finish\n`,
);

process.on('exit', () => {
  process.stdout.write(`\n${FAREWALL_PHRASE}`);
});

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  if (/\s*exit\s*/.test(line)) {
    rl.close();
  }
  ws.write(`${line}${EOL}`);
  rl.prompt();
}).on('close', () => process.exit(0));
