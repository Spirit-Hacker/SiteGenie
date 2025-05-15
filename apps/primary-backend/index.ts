import { prismaClient } from "db/client";
import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/project", authMiddleware, async (req, res) => {
  const { prompt } = req.body;
  const userId = req.userId!;

  // console.log("userId: ", userId);

  // add logic to get description of the project from the prompt, lets hardcode it for now
  const description = prompt.split("\n")[0];
  const project = await prismaClient.project.create({
    data: { description, userId },
  });

  console.log("projectId: ", project.id);
  res.json({ projectId: project.id });
  return;
});

app.get("/projects", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const projects = await prismaClient.project.findMany({
    where: { userId: userId },
  });

  // console.log("User Id: ", userId);
  // console.log("Projects: ", projects);

  res.json({ projects });
  return;
});

app.get("/prompts/:projectId", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const projectId = req.params.projectId;
  console.log("Project ID (get prompts): ", projectId);

  if (!userId) {
    res.status(404).json({
      success: false,
      message: "Inavalid Token, login again",
    });
    return;
  }

  const prompts = await prismaClient.prompt.findMany({
    where: { projectId: projectId },
  });

  res.status(200).json({
    prompts,
  });

  return;
});

app.get("/actions/:projectId", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const projectId = req.params.projectId;
  // console.log("Project ID (get prompts): ", projectId);

  if (!userId) {
    res.status(404).json({
      success: false,
      message: "Inavalid Token, login again",
    });
    return;
  }

  const actions = await prismaClient.action.findMany({
    where: { projectId: projectId },
  });

  res.status(200).json({
    actions,
  });

  return;
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
