import { createPreviewTrack } from "../_shared/preview";

export const track = createPreviewTrack({
  id: "java",
  order: 4,
  language: "Java",
  title: "Object Vault",
  archiveName: "The Typed Reliquary",
  description: "Reconstruct strongly typed objects, contracts, and application systems.",
  icon: "J",
  accent: "violet",
  lessonTitles: ["Typed Specimens", "Object Blueprints"],
  concepts: ["Java types", "classes and objects"],
  futureWorlds: ["Method Chamber", "Inheritance Branch", "Collection Vault"],
});
