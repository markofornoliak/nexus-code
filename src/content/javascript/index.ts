import { createPreviewTrack } from "../_shared/preview";

export const track = createPreviewTrack({
  id: "javascript",
  order: 2,
  language: "JavaScript",
  title: "Reactive Signal",
  archiveName: "The Event Lattice",
  description:
    "Decode browser events, functions, objects, and asynchronous transmissions.",
  icon: "JS",
  accent: "amber",
  lessonTitles: ["Signal Variables", "Event Echoes"],
  concepts: ["JavaScript values", "browser events"],
  futureWorlds: ["Function Relay", "Object Observatory", "Asynchronous Rift"],
});
