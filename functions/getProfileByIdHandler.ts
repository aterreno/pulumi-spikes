
import * as aws from "@pulumi/aws";
import { profilesTable } from "../infrastructure/dynamodb";

export const handle = async function handle(event : AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> {

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
}