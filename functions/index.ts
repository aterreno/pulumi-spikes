import { TableEvent } from "@pulumi/aws/dynamodb";
export async function handle(e: TableEvent): Promise<void> {
    console.log(JSON.stringify(e))
   for (const r  of e.Records) {
       console.log(JSON.stringify(r))
   }
}