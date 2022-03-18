import "dotenv/config";
import { readFile, writeFile } from "node:fs/promises";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { model as profileModel } from "@datamodels/identity-profile-basic";
import { ModelManager } from "@glazed/devtools";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays";

if (!process.env.CERAMIC_SEED) {
  throw new Error("Missing SEED environment variable");
}

const CERAMIC_URL =
  process.env.CERAMIC_URL || "https://ceramic-clay.3boxlabs.com";

// The seed must be provided as an environment variable
const seed = fromString(process.env.CERAMIC_SEED, "base16");
// Create and authenticate the DID
const did = new DID({
  provider: new Ed25519Provider(seed),
  resolver: getResolver(),
});
await did.authenticate();

// Connect to the Ceramic node
const ceramic = new CeramicClient(CERAMIC_URL);
ceramic.did = did;

// Load and create a manager for the model
const bytes = await readFile(new URL("./model.json", import.meta.url));
const manager = ModelManager.fromJSON(ceramic, JSON.parse(bytes.toString()));

const schemaID = manager.getSchemaID("BlogPost");

const stream = await manager.loadStream(schemaID);
stream.update({
  ...stream.content,
  properties: {
    ...stream.content.properties,
    subTitle: {
      type: "string",
      title: "text",
      maxLength: 1000,
    },
    slug: {
      type: "string",
      maxLength: 100,
    },
  },
});

// Write model to JSON file
await writeFile(
  new URL("./model.json", import.meta.url),
  JSON.stringify(manager.toJSON())
);
console.log("Encoded model written to scripts/model.json file");
