import { XP_RULES } from "../../app/config/gamification";
import type { Lesson } from "../../types";

type PythonLessonInput = Omit<Lesson, "trackId" | "xpReward" | "status"> & {
  xpReward?: number;
};

export function definePythonLesson(input: PythonLessonInput): Lesson {
  return {
    ...input,
    trackId: "python",
    xpReward: input.xpReward ?? XP_RULES.lessonCompletion,
    status: "available",
  };
}
