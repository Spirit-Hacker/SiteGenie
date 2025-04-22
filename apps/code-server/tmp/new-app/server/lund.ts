
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
