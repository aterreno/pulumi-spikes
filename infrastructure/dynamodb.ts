import * as aws from "@pulumi/aws";
import * as handler from "../functions";
import * as pulumi from "@pulumi/pulumi";

const env = pulumi.getStack();

export const profilesTable = new aws.dynamodb.Table("profiles", {
    attributes: [{ name: "id", type: "S" }],
    billingMode: "PAY_PER_REQUEST",
    hashKey: "id",
    tags: {
      Environment: env,
      Name: "link-profiles",
    },
    streamEnabled: true,
    streamViewType: "NEW_AND_OLD_IMAGES",
  });
  
  profilesTable.onEvent(
      "notify-on-profile-changes",
      evt => handler.handle(evt),
      { batchSize: 100, startingPosition: "LATEST" }
  );