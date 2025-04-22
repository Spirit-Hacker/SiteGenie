import fs from "fs/promises";
import { dirname, join } from "path";
import os from "os";
import { prismaClient } from "db/client";

const BASE_WORKER_DIR = join(
  os.homedir(),
  "Projects",
  "bolt-mobile-app",
  "apps",
  "code-server",
  "tmp",
  "bolty-worker"
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
  await prismaClient.action.create({
    data: {
      projectId,
      content: `Updated File ${filePath}`,
    },
  });
}

export async function onShellCommand(shellCommand: string, projectId: string) {
  // npx --yes vite@latest chess-app && cd chess-app && npm install && npm run dev

  const isWindows = os.platform() === "win32";

  const shellExecutable = isWindows ? "cmd.exe" : "bash";
  const shellArg = isWindows ? "/c" : "-c";

  // console.log("platform: ", isWindows);
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

    await prismaClient.action.create({
      data: {
        projectId,
        content: `Run command ${command.trim()}`,
      },
    });
  }
}

// export async function onShellCommand(shellCommand: string, projectId: string) {
//   // npx --yes vite@latest chess-app && cd chess-app && npm install && npm run dev

//   const commands = shellCommand.split("&&");
//   for (const command of commands) {
//     const trimmedCommand = command.trim();
//     if (!trimmedCommand) {
//       continue;
//     }

//     console.log("Running command: ", trimmedCommand);
//     const result = Bun.spawnSync({
//       cmd: trimmedCommand.split(" "),
//       cwd: BASE_WORKER_DIR,
//     });

//     console.log(result.stdout.toString());
//     console.log(result.stderr.toString());

//     await prismaClient.action.create({
//       data: {
//         projectId,
//         content: `Run command ${trimmedCommand}`,
//       },
//     });
//   }
// }
