import * as random from "@pulumi/random";
import * as aws from "@pulumi/aws";

import { createIamRole } from "./iam";
import { profilesTable } from "./dynamodb";

const role = createIamRole("iam", profilesTable);

const schema =
    `type Query {
        getProfileById(id: ID!): Profile
    }
    type Mutation {
        addProfile(id: ID!, name: String!): Profile!
    }
    type Profile {
        id: ID!
        name: String
    }
    schema {
        query: Query
        mutation: Mutation
    }`;

const randomString = new random.RandomString("random-datasource-name", {
  length: 15,
  special: false,
  number: false,
});

export const api = new aws.appsync.GraphQLApi("api", {
    authenticationType: "API_KEY",
    schema,
});

export const apiKey = new aws.appsync.ApiKey("key", {
  apiId: api.id,
});

const dataSource = new aws.appsync.DataSource("profile-ds", {
    name: randomString.result,
    apiId: api.id,
    type: "AMAZON_DYNAMODB",
    dynamodbConfig: {
        tableName: profilesTable.name,
    },
    serviceRoleArn: role.arn,
  });

new aws.appsync.Resolver("get-resolver", {
  apiId: api.id,
  dataSource: dataSource.name,
  type: "Query",
  field: "getProfileById",
  requestTemplate: `{
      "version": "2017-02-28",
      "operation": "GetItem",
      "key": {
          "id": $util.dynamodb.toDynamoDBJson($ctx.args.id),
      }
  }`,
  responseTemplate: `$util.toJson($ctx.result)`,
});

new aws.appsync.Resolver("add-resolver", {
  apiId: api.id,
  dataSource: dataSource.name,
  type: "Mutation",
  field: "addProfile",
  requestTemplate: `{
      "version" : "2017-02-28",
      "operation" : "PutItem",
      "key" : {
          "id" : $util.dynamodb.toDynamoDBJson($ctx.args.id)
      },
      "attributeValues" : {
          "name": $util.dynamodb.toDynamoDBJson($ctx.args.name)
      }
  }`,
  responseTemplate: `$util.toJson($ctx.result)`,
});

