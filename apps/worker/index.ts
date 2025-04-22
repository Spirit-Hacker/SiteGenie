import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import { systemPrompt } from "./systemPrompt";
import { prismaClient } from "db/client";
import { ArtifactProcessor } from "./parser";
import { onFileUpdate, onShellCommand } from "./os";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/prompt", async (req, res) => {
  const { prompt, projectId } = req.body;
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  await prismaClient.prompt.create({
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
      onFileUpdate(filePath, fileContent, projectId),
    (shellCommand) => onShellCommand(shellCommand, projectId)
  );
  let artifact = "";

  let response = client.messages
    .stream({
      messages: allPrompts.map((prompt: any) => ({
        role: prompt.type === "USER" ? "user" : "assistant",
        content: prompt.content,
      })),
      system: systemPrompt("REACT_NATIVE"),
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
