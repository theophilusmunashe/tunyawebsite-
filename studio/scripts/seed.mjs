/**
 * Seeds the Sanity dataset with the copy and imagery currently bundled with the
 * website, so editors start from the live site rather than empty fields.
 *
 * Usage (from the studio folder):
 *   SANITY_STUDIO_PROJECT_ID=xxx SANITY_WRITE_TOKEN=yyy npm run seed
 *
 * Safe to re-run: it replaces the singleton documents wholesale.
 */
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

import { defaults } from "../../src/content/defaults/index.js";
import { documents } from "../schemas/documents.js";
import { sharedTypes } from "../schemas/helpers.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(here, "../../public");

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) exit("Set SANITY_STUDIO_PROJECT_ID to your Sanity project id.");
if (!token) exit("Set SANITY_WRITE_TOKEN to a token with write access (Sanity dashboard → API → Tokens).");

const client = createClient({ projectId, dataset, token, apiVersion: "2024-10-01", useCdn: false });

const registry = new Map(sharedTypes.map((t) => [t.name, t]));
const uploadCache = new Map();

async function uploadAsset(localPath) {
  if (uploadCache.has(localPath)) return uploadCache.get(localPath);
  const file = path.join(PUBLIC_DIR, localPath.replace(/^\//, ""));
  if (!fs.existsSync(file)) {
    console.warn(`  ! missing asset, leaving empty: ${localPath}`);
    uploadCache.set(localPath, null);
    return null;
  }
  const asset = await client.assets.upload("image", fs.createReadStream(file), {
    filename: path.basename(file)
  });
  console.log(`  ↑ ${path.basename(file)}`);
  uploadCache.set(localPath, asset._id);
  return asset._id;
}

/** Resolves the schema definition backing an array member or object field. */
function fieldsOf(def) {
  if (!def) return null;
  if (def.fields) return def.fields;
  const named = registry.get(def.type);
  return named ? named.fields : null;
}

async function convert(value, field) {
  if (value === undefined || value === null) return undefined;

  if (field?.type === "image") {
    if (typeof value !== "string" || !value.startsWith("/")) return undefined;
    const ref = await uploadAsset(value);
    return ref ? { _type: "image", asset: { _type: "reference", _ref: ref } } : undefined;
  }

  if (field?.type === "array") {
    const of = field.of?.[0];
    const isPrimitive = of && ["string", "text", "number", "boolean"].includes(of.type);
    const itemFields = isPrimitive ? null : fieldsOf(of);
    const itemType = isPrimitive ? null : of?.name || of?.type;

    const out = [];
    for (const item of value) {
      if (isPrimitive) {
        out.push(item);
        continue;
      }
      const converted = await convertObject(item, itemFields);
      out.push({ ...converted, _type: itemType, _key: randomUUID().slice(0, 12) });
    }
    return out;
  }

  if (field?.type === "object" || registry.has(field?.type)) {
    return convertObject(value, fieldsOf(field));
  }

  return value;
}

async function convertObject(value, fields) {
  if (!fields) return value;
  const out = {};
  for (const field of fields) {
    const converted = await convert(value?.[field.name], field);
    if (converted !== undefined) out[field.name] = converted;
  }
  return out;
}

async function main() {
  console.log(`Seeding project ${projectId} / dataset ${dataset}\n`);
  const docs = [];

  for (const schema of documents) {
    const source = defaults[schema.name];
    if (!source) {
      console.warn(`No local content for "${schema.name}", skipping.`);
      continue;
    }
    console.log(`${schema.title}`);
    const body = await convertObject(source, schema.fields);
    docs.push({ _id: schema.name, _type: schema.name, ...body });
  }

  const tx = docs.reduce((t, doc) => t.createOrReplace(doc), client.transaction());
  await tx.commit();

  console.log(`\nSeeded ${docs.length} documents. Open the Studio with "npm run dev".`);
}

function exit(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}

main().catch((err) => exit(err.message));
