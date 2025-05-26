import express from "express";
import cors from "cors";
import {
  AutoScalingClient,
  DescribeAutoScalingInstancesCommand,
  SetDesiredCapacityCommand,
  TerminateInstanceInAutoScalingGroupCommand,
} from "@aws-sdk/client-auto-scaling";
import { DescribeInstancesCommand, EC2Client } from "@aws-sdk/client-ec2";

const app = express();
app.use(cors());
app.use(express.json());

const client = new AutoScalingClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

const ec2Client = new EC2Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

type MACHINE = {
  ip: string;
  isUsed: boolean;
  assignedProject?: string;
};

let ALL_MACHINES: MACHINE[] = [];
const ACTIVE_MACHINE_IP = new Set<string>();

const refreshInstances = async () => {
  const command = new DescribeAutoScalingInstancesCommand();
  const allAutoScalingMachines = await client.send(command);
  console.log(allAutoScalingMachines);

  const ec2InstanceCommand = new DescribeInstancesCommand({
    InstanceIds: allAutoScalingMachines.AutoScalingInstances?.map(
      (instance) => instance.InstanceId
    ),
  });

  const ec2Response = await ec2Client.send(ec2InstanceCommand);

  console.log(
    ec2Response?.Reservations?.[0]?.Instances?.[0]?.NetworkInterfaces?.[0]
      ?.Association?.PublicIp
  );

  // TODO: add all the new machines to ALL_MACHINES array, and remove the instances that have died

  // add all the new machines to ACTIVE_MACHINE_IP
  ACTIVE_MACHINE_IP.clear();
  ec2Response?.Reservations?.forEach((reservation) => {
    reservation.Instances?.forEach((instance) => {
      const publicIp = instance.NetworkInterfaces?.[0]?.Association?.PublicIp;
      if (publicIp) {
        ACTIVE_MACHINE_IP.add(publicIp);

        if (!ALL_MACHINES.find((machine) => machine.ip === publicIp)) {
          ALL_MACHINES.push({
            ip: publicIp,
            isUsed: false,
          });
        }
      }
    });
  });

  // remove the instances that have died
  ALL_MACHINES = ALL_MACHINES.filter((machine) =>
    ACTIVE_MACHINE_IP.has(machine.ip)
  );

  console.log(ALL_MACHINES);
};

await refreshInstances();

setInterval(async () => {
  await refreshInstances();
}, 10 * 1000);

app.get("/:projectId", async (req, res) => {
  const idleMachine = ALL_MACHINES.find((machine) => machine.isUsed === false);
  if (!idleMachine) {
    // scale up the infrastructure
    res.status(400).send("No idle machines");
    return;
  }
  idleMachine.isUsed = true;
  // scale up the infrastructure
  // 2 + 5 - 2 = 5 := all machines available + (totalIdleMachinesWeWant - idleMachines)
  const command = new SetDesiredCapacityCommand({
    AutoScalingGroupName: process.env.ASG_NAME!,
    DesiredCapacity:
      ALL_MACHINES.length +
      (5 - ALL_MACHINES.filter((machine) => machine.isUsed === false).length),
  });

  await client.send(command);

  res.send({
    ip: idleMachine.ip,
  });
});

app.post("/destroy", async (req, res) => {
  const { machineId } = req.body;

  const command = new TerminateInstanceInAutoScalingGroupCommand({
    InstanceId: machineId,
    ShouldDecrementDesiredCapacity: true,
  });

  await client.send(command);
  res.send("Machine destroyed: " + machineId);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
