import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas/index.js";
import { documents } from "./schemas/documents.js";

// Every section is a singleton: one document per page, with a fixed id the
// website queries directly.
const singletons = documents.map((d) => ({ id: d.name, title: d.title }));

export default defineConfig({
  name: "tunyafrika",
  title: "Tunyafrika Xperiences",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Website content")
          .items(
            singletons.map(({ id, title }) =>
              S.listItem()
                .id(id)
                .title(title)
                .child(S.document().documentId(id).schemaType(id).title(title))
            )
          )
    }),
    visionTool()
  ],
  schema: {
    types: schemaTypes,
    // Singletons are created by the seed script, never from the "new document" menu.
    templates: (prev) => prev.filter((t) => !singletons.some((s) => s.id === t.schemaType))
  },
  document: {
    actions: (prev) =>
      prev.filter(({ action }) => !["duplicate", "delete", "unpublish"].includes(action))
  }
});
