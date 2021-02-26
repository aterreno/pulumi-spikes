

import { buildProject} from "./infrastructure/codebuild";
import { apigatewayEndpoint } from "./infrastructure/apigateway";
import { api, apiKey } from "./infrastructure/appsync";

export const endpointApiGW = apigatewayEndpoint.url;
export const endpoint = api.uris["GRAPHQL"];
export const key = apiKey.key;
export const build = buildProject.name;