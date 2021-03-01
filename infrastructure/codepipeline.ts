import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { buildProject as project } from "./codebuild";

const githHubConnection = new aws.codestarconnections.Connection("example", {providerType: "GitHub"});

const codepipelineBucket = new aws.s3.Bucket("codepipeline-bucket", {acl: "private"});

const codepipelineRole = new aws.iam.Role("codepipeline-role", {assumeRolePolicy: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codepipeline.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
`});

const s3kmskey = new aws.kms.Key("codepipeline-key", {});

export const codepipeline = new aws.codepipeline.Pipeline("pulumi-spikes-pipeline", {
    roleArn: codepipelineRole.arn,
    artifactStore: {
        location: codepipelineBucket.bucket,
        type: "S3",
        encryptionKey: {
          id: s3kmskey.id,
          type: "KMS",
        },
    },
    stages: [
        {
            name: "Source",
            actions: [{
                name: "Source",
                category: "Source",
                owner: "AWS",
                provider: "CodeStarSourceConnection",
                version: "1",
                outputArtifacts: ["source_output"],
                configuration: {
                    ConnectionArn: githHubConnection.arn,
                    FullRepositoryId: "aterreno/pulumi-spikes",
                    BranchName: "main",
                },
            }],
        },
        {
            name: "Build",
            actions: [{
                name: "Build",
                category: "Build",
                owner: "AWS",
                provider: "CodeBuild",
                inputArtifacts: ["source_output"],
                outputArtifacts: ["build_output"],
                version: "1",
                configuration: {
                    ProjectName: project.name,
                },
            }],
        },
        // {
        //     name: "Deploy",
        //     actions: [{
        //         name: "Deploy",
        //         category: "Deploy",
        //         owner: "AWS",
        //         provider: "CloudFormation",
        //         inputArtifacts: ["build_output"],
        //         version: "1",
        //         configuration: {
        //             ActionMode: "REPLACE_ON_FAILURE",
        //             Capabilities: "CAPABILITY_AUTO_EXPAND,CAPABILITY_IAM",
        //             OutputFileName: "CreateStackOutput.json",
        //             StackName: "MyStack",
        //             TemplatePath: "build_output::sam-templated.yaml",
        //         },
        //     }],
        // },
    ],    
});

const policy = new aws.iam.RolePolicy("codepipeline-policy", {
  role: codepipelineRole.id,
  policy: pulumi.interpolate`{
"Version": "2012-10-17",
"Statement": [
  {
    "Effect":"Allow",
    "Action": [        
      "s3:GetObject",
      "s3:GetObjectVersion",
      "s3:GetBucketVersioning",
      "s3:PutObject"
    ],
    "Resource": [
      "${codepipelineBucket.arn}",
      "${codepipelineBucket.arn}/*"
    ]
  },
  {
    "Effect": "Allow",
    "Action": [
      "codebuild:BatchGetBuilds",
      "codebuild:StartBuild"
    ],
    "Resource": "*"
  },
  {
      "Effect": "Allow",
      "Action": "codestar-connections:UseConnection",
      "Resource": "${githHubConnection.arn}"
  }
]
}
`,
});