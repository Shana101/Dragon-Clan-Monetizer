// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  CREATE COSMOS DB CONTAINERS FOR DCM                                      ║
// ║  Run: npx tsx server/create-containers.ts                                 ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

import { CosmosClient } from "@azure/cosmos";

const COSMOS_CONNECTION = process.env.COSMOS_CONNECTION || "";
const DB_NAME = "HeidiCore";

const containers = [
  { id: "dcm-users",     partitionKey: "/id" },
  { id: "dcm-earnings",  partitionKey: "/userId" },
  { id: "dcm-tiers",     partitionKey: "/userId" },
  { id: "dcm-quests",    partitionKey: "/userId" },
  { id: "dcm-posts",     partitionKey: "/userId" },
  { id: "dcm-analytics", partitionKey: "/userId" },
];

async function main() {
  if (!COSMOS_CONNECTION) {
    console.error("ERROR: Set COSMOS_CONNECTION environment variable");
    process.exit(1);
  }

  const client = new CosmosClient(COSMOS_CONNECTION);
  const { database } = await client.databases.createIfNotExists({ id: DB_NAME });
  console.log(`Database: ${DB_NAME}`);

  for (const c of containers) {
    const { container } = await database.containers.createIfNotExists({
      id: c.id,
      partitionKey: { paths: [c.partitionKey] },
    });
    console.log(`  ✅ Container: ${c.id} (partition: ${c.partitionKey})`);
  }

  console.log("\nAll DCM containers ready!");
}

main().catch(console.error);
