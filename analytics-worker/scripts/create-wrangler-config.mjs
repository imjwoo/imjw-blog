import { readFile, writeFile } from "node:fs/promises";

const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
const zoneId = process.env.CLOUDFLARE_ZONE_ID;

if (!databaseId || !zoneId) {
  throw new Error("CLOUDFLARE_D1_DATABASE_ID and CLOUDFLARE_ZONE_ID are required");
}

const templateUrl = new URL("../wrangler.example.jsonc", import.meta.url);
const outputUrl = new URL("../wrangler.jsonc", import.meta.url);
const template = await readFile(templateUrl, "utf8");
const config = template
  .replace("REPLACE_WITH_D1_DATABASE_ID", databaseId)
  .replace("REPLACE_WITH_CLOUDFLARE_ZONE_ID", zoneId);

await writeFile(outputUrl, config, "utf8");
