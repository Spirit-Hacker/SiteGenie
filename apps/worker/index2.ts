import fs from "fs/promises";
import { dirname, join } from "path";
import os from "os";
// import { prismaClient } from "db/client";

const BASE_WORKER_DIR = join(
  os.homedir(),
  "Projects",
  "bolt-mobile-app",
  "apps",
  "code-server",
  "tmp",
  "new-app"
);
console.log("BASE_WORKER_DIR: ", BASE_WORKER_DIR);

export async function onFileUpdate(
  filePath: string,
  fileContent: string,
  projectId: string
) {
  console.log("updating file: ", filePath);
  const fullPath = join(BASE_WORKER_DIR, filePath);
  await fs.mkdir(dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, fileContent, {
    encoding: "utf-8",
  });
}

export function onShellCommand(shellCommand: string, projectId: string) {
  // npx --yes vite@latest chess-app && cd chess-app && npm install && npm run dev

  const isWindows = os.platform() === "win32";

  const shellExecutable = isWindows ? "cmd.exe" : "bash";
  const shellArg = isWindows ? "/c" : "-c";

  console.log("platform: ", isWindows);
  console.log("Running command full: ", shellCommand);

  const commands = shellCommand.split("&&");
  for (const command of commands) {
    console.log("current running command: ", command);

    const result = Bun.spawnSync({
      cmd: [shellExecutable, shellArg, command.trim()],
      cwd: BASE_WORKER_DIR,
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = result.stdout?.toString().trim();
    const error = result.stderr?.toString().trim();

    if (output) {
      console.log("Command Output:\n", output);
    }

    if (error) {
      console.error("Command Error:\n", error);
    }
  }
}

onShellCommand(
  "mkdir server && mkdir client && cd server && pwd",
  "your_project_id"
);

onShellCommand("pwd", "your_project_id");

const code = `
  export async function onFileUpdate(
  filePath: string,
  fileContent: string,
  projectId: string
) {
  console.log("updating file: ", filePath);
  const fullPath = join(BASE_WORKER_DIR, filePath);
  await fs.mkdir(dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, fileContent, {
    encoding: "utf-8",
  });
}
`;

onFileUpdate("/server/lund.ts", code, "projectId");
