import type { Lesson, Track, World } from "../../types";
import { world as logicChambers } from "./worlds/logic-chambers/world";
import { world as memoryStructures } from "./worlds/memory-structures/world";
import { world as signalAwakening } from "./worlds/signal-awakening/world";

interface LessonModule {
  default: Lesson;
}

const lessonModules = import.meta.glob<LessonModule>("./worlds/**/lessons/*.ts", {
  eager: true,
});

const lessons = Object.values(lessonModules).map((module) => module.default);

function withLessons(definition: Omit<World, "lessons">): World {
  return {
    ...definition,
    lessons: lessons
      .filter((lesson) => lesson.worldId === definition.id)
      .sort((left, right) => left.order - right.order),
  };
}

export const track: Track = {
  id: "python",
  order: 1,
  language: "Python",
  title: "Python Core",
  archiveName: "The Serpentine Archive",
  description:
    "Restore a complete beginner pathway from first output to an integrated archive scanner.",
  difficulty: "beginner",
  status: "available",
  icon: "PY",
  accent: "lime",
  worlds: [signalAwakening, logicChambers, memoryStructures].map(withLessons),
};
