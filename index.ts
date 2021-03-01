

import { buildProject} from "./infrastructure/codebuild";
import { apigatewayEndpoint } from "./infrastructure/apigateway";
import { api, apiKey } from "./infrastructure/appsync";
import * as frontend from "./infrastructure/frontend";
import * as codepipeline from "./infrastructure/codepipeline";

export const endpointApiGW = apigatewayEndpoint.url;
export const endpoint = api.uris["GRAPHQL"];
export const key = apiKey.key;
export const build = buildProject.name;

export const contentBucketUri = frontend.contentBucketUri;
export const contentBucketWebsiteEndpoint = frontend.contentBucketWebsiteEndpoint;
export const cloudFrontDomain = frontend.cloudFrontDomain;
export const targetDomainEndpoint = frontend.targetDomainEndpoint;

export const pipeline = codepipeline.codepipeline.name;