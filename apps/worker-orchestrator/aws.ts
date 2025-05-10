import { AutoScalingClient, SetDesiredCapacityCommand } from "@aws-sdk/client-auto-scaling";

const client = new AutoScalingClient({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!
    }
});

const command = new SetDesiredCapacityCommand({
    AutoScalingGroupName: process.env.ASG_NAME!,
    DesiredCapacity: 1
});

const data = await client.send(command);

console.log("Done", data);