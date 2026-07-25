import { getOrderedLessons, getTrack } from "../../content/registry";
import { defaultProgress } from "../../services/storage/schema";
import { isLessonUnlocked, selectTrackProgress } from "./progressSelectors";

describe("progress selectors", () => {
  const python = getTrack("python");
  if (!python) throw new Error("Python fixture missing.");
  const lessons = getOrderedLessons(python);
  const first = lessons[0];
  const second = lessons[1];
  if (!first || !second) throw new Error("Lesson fixture missing.");

  it("unlocks the first fragment and locks its successor", () => {
    expect(isLessonUnlocked(python, first.id, defaultProgress)).toBe(true);
    expect(isLessonUnlocked(python, second.id, defaultProgress)).toBe(false);
  });

  it("unlocks the successor after previous completion", () => {
    const progress = structuredClone(defaultProgress);
    progress.lessons[first.id] = {
      lessonId: first.id,
      completedTaskIds: first.tasks.map((task) => task.id),
      completedBonusTaskIds: [],
      isCompleted: true,
      xpAwarded: 110,
      startedAt: "2026-07-20T10:00:00.000Z",
      completedAt: "2026-07-20T10:05:00.000Z",
      updatedAt: "2026-07-20T10:05:00.000Z",
    };
    expect(isLessonUnlocked(python, second.id, progress)).toBe(true);
    expect(selectTrackProgress(python, progress).completedLessons).toBe(1);
  });
});
