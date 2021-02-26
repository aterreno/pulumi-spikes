import * as aws from "@pulumi/aws";

export function createIamRole(name: string, table: aws.dynamodb.Table) : aws.iam.Role {
    const role = new aws.iam.Role(`${name}-role`, {
        assumeRolePolicy: aws.iam.getPolicyDocument({
                statements: [{
                    actions: ["sts:AssumeRole"],
                    principals: [{
                        identifiers: ["appsync.amazonaws.com"],
                        type: "Service",
                    }],
                    effect: "Allow",
                }],
            }, { async: true }).then(doc => doc.json),
    });

    const policy = new aws.iam.Policy(`${name}-policy`, {
        policy: table.arn.apply(arn => aws.iam.getPolicyDocument({
            statements: [{
                actions: ["dynamodb:PutItem", "dynamodb:GetItem"],
                resources: [arn],
                effect: "Allow",
            }],
        }, { async: true }).then(doc => doc.json)),
    });

    new aws.iam.RolePolicyAttachment(`${name}-rpa`, {
        role: role,
        policyArn: policy.arn,
    });

    return role;
}
