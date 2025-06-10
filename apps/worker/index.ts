import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import { systemPrompt } from "./systemPrompt";
import { prismaClient } from "db/client";
import { ArtifactProcessor } from "./parser";
import { onFileUpdate, onShellCommand } from "./os";
import { authMiddleware } from "./middleware";

const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());

app.post("/prompt", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const { prompt, projectId } = req.body;
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    // user is on a basic plan
    const prompts = await prismaClient.prompt.findMany({
      where: {
        projectId: projectId,
      },
    });

    if (prompts.length >= 5) {
      res.status(400).json({
        success: false,
        message: "You have reached your prompt limit",
      });
      return;
    }
  }

  const userPrompt = await prismaClient.prompt.create({
    data: {
      content: prompt,
      projectId,
      type: "USER",
    },
  });

  const allPrompts = await prismaClient.prompt.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Write an Artifact processor that will take in the prompt and the system prompt and return an artifact
  let artifactProcessor = new ArtifactProcessor(
    "",
    (filePath, fileContent) =>
      onFileUpdate(filePath, fileContent, projectId, userPrompt.id),
    (shellCommand) => onShellCommand(shellCommand, projectId, userPrompt.id)
  );
  let artifact = "";

  let response = client.messages
    .stream({
      messages: allPrompts.map((prompt: any) => ({
        role: prompt.type === "USER" ? "user" : "assistant",
        content: prompt.content,
      })),
      system: systemPrompt("NEXTJS"),
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 8000,
    })
    .on("text", (text) => {
      artifactProcessor.append(text);
      artifactProcessor.parse();
      artifact += text;
    })
    .on("finalMessage", async (message) => {
      console.log("Done!");
      await prismaClient.prompt.create({
        data: {
          content: artifact,
          projectId,
          type: "SYSTEM",
        },
      });
    })
    .on("error", (error) => {
      console.error(error);
    });

  res.json({ response });
});

app.listen(9092, () => {
  console.log("Server is running on port 9092");
});
