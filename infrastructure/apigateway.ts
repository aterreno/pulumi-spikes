import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { profilesTable } from "./dynamodb";

export const  apigatewayEndpoint = new awsx.apigateway.API("profiles", {
    routes: [{
        path: "/profiles/{id+}",
        method: "GET",
        eventHandler: async (event) => {
            console.log(JSON.stringify(event));
            const id = event.pathParameters?.["id"];
            console.log(`Getting profile for '${id}'`);
  
            const client = new aws.sdk.DynamoDB.DocumentClient();
  
            const tableData = await client.get({
                TableName: profilesTable.name.get(),
                Key: { id },
                ConsistentRead: true,
            }).promise();
  
            const profile = tableData.Item;
                      
            return {
                statusCode: 200,
                body: JSON.stringify({ profile }),
            };
        },
    }],
  });