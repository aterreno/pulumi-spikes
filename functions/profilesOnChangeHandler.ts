import { TableEvent } from "@pulumi/aws/dynamodb";

export const handle = async function handle(e: TableEvent): Promise<void> {
    console.log(JSON.stringify(e))
   for (const r  of e.Records) {
       console.log(JSON.stringify(r))
   }

   // TODO can do some mapping for example and return it just to write tests
}