import { getLesson } from "../../content/registry";
import { defaultStoredState } from "../../services/storage/schema";
import { progressReducer } from "./progressReducer";

const entry = getLesson("python", "python-first-signal");
if (!entry) throw new Error("Fixture lesson missing.");
const [firstTask, secondTask] = entry.lesson.tasks;
if (!firstTask || !secondTask) throw new Error("Fixture tasks missing.");

describe("progress reducer", () => {
  it("awards task XP only once", () => {
    const action = {
      type: "record-task" as const,
      lesson: entry.lesson,
      taskId: firstTask.id,
      label: firstTask.title,
      bonus: false,
      now: new Date("2026-07-20T10:00:00"),
    };
    const once = progressReducer(structuredClone(defaultStoredState), action);
    const twice = progressReducer(once, action);
    expect(once.progress.totalXp).toBe(25);
    expect(twice.progress.totalXp).toBe(25);
    expect(twice.progress.lessons[entry.lesson.id]?.completedTaskIds).toEqual([
      firstTask.id,
    ]);
  });

  it("prevents lesson completion until every standard task is done", () => {
    const initial = structuredClone(defaultStoredState);
    const incomplete = progressReducer(initial, {
      type: "complete-lesson",
      lesson: entry.lesson,
    });
    expect(incomplete.progress.totalXp).toBe(0);

    const afterFirst = progressReducer(initial, {
      type: "record-task",
      lesson: entry.lesson,
      taskId: firstTask.id,
      label: firstTask.title,
      bonus: false,
    });
    const afterSecond = progressReducer(afterFirst, {
      type: "record-task",
      lesson: entry.lesson,
      taskId: secondTask.id,
      label: secondTask.title,
      bonus: false,
    });
    const complete = progressReducer(afterSecond, {
      type: "complete-lesson",
      lesson: entry.lesson,
    });
    const duplicate = progressReducer(complete, {
      type: "complete-lesson",
      lesson: entry.lesson,
    });
    expect(complete.progress.lessons[entry.lesson.id]?.isCompleted).toBe(true);
    expect(complete.progress.totalXp).toBe(110);
    expect(duplicate.progress.totalXp).toBe(110);
  });
});
