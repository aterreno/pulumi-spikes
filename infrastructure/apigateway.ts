import * as awsx from "@pulumi/awsx";
import { handle} from "../functions/getProfileByIdHandler" 

export const  apigatewayEndpoint = new awsx.apigateway.API("profiles", {
    routes: [{
        path: "/profiles/{id+}",
        method: "GET",
        eventHandler: async (event) => 
            handle(event)
        ,
    }],
  });