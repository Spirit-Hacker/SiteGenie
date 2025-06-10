import { prismaClient } from "db/client";
import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});
import type Stripe from "stripe";

const app = express();

// Stripe webhook
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    const signature = req.headers["stripe-signature"] as string;

    console.log("Signature: ", signature);
    console.log("Endpoint Secret: ", endpointSecret);

    let event: any;
    try {
      event = await stripe.webhooks.constructEventAsync(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err: Error | any) {
      console.log(`⚠️  Webhook signature verification failed. `, err.message);
      res.sendStatus(400);
      return;
    }

    console.log("Event: ", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const planType = session.metadata.planType;
      console.log("User Id: ", userId);
      console.log("planType: ", planType);
      console.log("session: ", session);
      console.log("session Id: ", session.id);

      const user = await prismaClient.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        await prismaClient.user.create({
          data: {
            id: userId,
            plan: planType,
            clerkId: userId,
            planStartedAt: new Date(Date.now()),
            planEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      } else {
        await prismaClient.user.update({
          where: {
            id: userId,
          },
          data: {
            plan: planType,
            clerkId: userId,
            planStartedAt: new Date(Date.now()),
            planEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }

    res.sendStatus(200);
    return;
  }
);

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

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized, token expired",
    });
    return;
  }

  // console.log("userId: ", userId);

  // check how many projects this user has
  const projects = await prismaClient.project.findMany({
    where: { userId: userId },
  });

  // find which plan this user has purchased
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    // user is on basic plan
    if (projects && projects.length >= 2) {
      res.status(400).json({
        success: false,
        message:
          "You have reached the maximum number of projects, please upgrade your plan",
      });
      return;
    }
  } else {
    // user is with premium or business plan
    if (user.plan === "PREMIUM" && projects && projects.length >= 10) {
      res.status(400).json({
        success: false,
        message:
          "You have reached the maximum number of projects, please upgrade your plan",
      });
      return;
    }
  }

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

// Add Payment gateway
app.post("/create-checkout-session", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  console.log("User Id: ", userId);
  if (!userId) {
    res.status(404).json({
      success: false,
      message: "Inavalid Token, login again",
    });
    return;
  }

  const { planType } = req.body;

  // check if this user already has a plan
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (
    user &&
    user.plan === "PREMIUM" &&
    planType === "PREMIUM" &&
    user.planEndsAt > new Date(Date.now())
  ) {
    res.status(400).json({
      success: false,
      message: "User already has a plan",
    });
    return;
  } else if (
    user &&
    user.plan === "BUSINESS" &&
    (planType === "BUSINESS" || planType === "PREMIUM") &&
    user.planEndsAt > new Date(Date.now())
  ) {
    res.status(400).json({
      success: false,
      message: "User already has a plan",
    });
    return;
  }

  // TODO: Add payment gateway logic here ✅
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price:
          planType === "PREMIUM"
            ? process.env.STRIPE_PRICE_KEY_PREMIUM!
            : process.env.STRIPE_PRICE_KEY_BUSINESS!,
        quantity: 1,
      },
    ],
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
    metadata: { userId: userId, planType: planType },
  });

  res.status(200).json({
    success: true,
    sessionId: session.id,
  });
  return;
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
