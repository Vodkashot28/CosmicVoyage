import * as readline from "readline";
import { spawn } from "child_process";

const answers = ["testnet", "", "", "", ""];
let answerIndex = 0;

const child = spawn("npx", ["blueprint", "run", "deploy"], {
  cwd: "/home/runner/workspace/contracts-blueprint",
  stdio: ["pipe", "inherit", "inherit"],
});

const rl = readline.createInterface({
  input: child.stdin,
  output: process.stdout,
});

// Automatically provide answers to prompts
setTimeout(() => {
  if (answerIndex < answers.length) {
    child.stdin.write(answers[answerIndex] + "\n");
    answerIndex++;
  }
}, 500);

child.on("exit", (code) => {
  console.log(`\nDeploy script exited with code ${code}`);
  process.exit(code);
});
