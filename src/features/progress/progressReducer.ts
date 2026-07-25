import { ACTIVITY_LIMIT, XP_RULES } from "../../app/config/gamification";
import { achievements } from "../../content/achievements";
import type {
  Lesson,
  LearningActivity,
  StoredApplicationState,
  UserProgress,
} from "../../types";
import { updateStreak } from "../../lib/date";
import { defaultStoredState } from "../../services/storage/schema";
import { newlyUnlockedAchievements } from "./progressSelectors";

export type ProgressAction =
  | {
      type: "record-task";
      lesson: Lesson;
      taskId: string;
      label: string;
      bonus: boolean;
      now?: Date;
    }
  | { type: "complete-lesson"; lesson: Lesson; now?: Date }
  | { type: "set-name"; displayName: string }
  | { type: "set-editor-font-size"; size: number }
  | { type: "set-hints-expanded"; expanded: boolean }
  | { type: "import"; state: StoredApplicationState }
  | { type: "reset" };

function activity(
  type: LearningActivity["type"],
  label: string,
  xp: number,
  occurredAt: string,
): LearningActivity {
  return {
    id: `${type}-${occurredAt}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    label,
    xp,
    occurredAt,
  };
}

function addAchievements(progress: UserProgress, occurredAt: string): UserProgress {
  const unlocked = newlyUnlockedAchievements(progress);
  if (unlocked.length === 0) return progress;

  return {
    ...progress,
    unlockedAchievementIds: [
      ...progress.unlockedAchievementIds,
      ...unlocked.map((achievement) => achievement.id),
    ],
    achievementDates: {
      ...progress.achievementDates,
      ...Object.fromEntries(unlocked.map((achievement) => [achievement.id, occurredAt])),
    },
    activity: [
      ...unlocked.map((achievement) =>
        activity("achievement", `Relic recovered: ${achievement.name}`, 0, occurredAt),
      ),
      ...progress.activity,
    ].slice(0, ACTIVITY_LIMIT),
  };
}

function recordTask(
  state: StoredApplicationState,
  action: Extract<ProgressAction, { type: "record-task" }>,
): StoredApplicationState {
  const now = action.now ?? new Date();
  const timestamp = now.toISOString();
  const existing = state.progress.lessons[action.lesson.id];
  const completedIds = action.bonus
    ? (existing?.completedBonusTaskIds ?? [])
    : (existing?.completedTaskIds ?? []);

  if (completedIds.includes(action.taskId)) return state;

  const xp = action.bonus ? XP_RULES.bonusTask : XP_RULES.standardTask;
  const lessonProgress = {
    lessonId: action.lesson.id,
    completedTaskIds: action.bonus
      ? (existing?.completedTaskIds ?? [])
      : [...(existing?.completedTaskIds ?? []), action.taskId],
    completedBonusTaskIds: action.bonus
      ? [...(existing?.completedBonusTaskIds ?? []), action.taskId]
      : (existing?.completedBonusTaskIds ?? []),
    isCompleted: existing?.isCompleted ?? false,
    xpAwarded: (existing?.xpAwarded ?? 0) + xp,
    startedAt: existing?.startedAt ?? timestamp,
    ...(existing?.completedAt ? { completedAt: existing.completedAt } : {}),
    updatedAt: timestamp,
  };

  const progress: UserProgress = {
    ...state.progress,
    totalXp: state.progress.totalXp + xp,
    lessons: { ...state.progress.lessons, [action.lesson.id]: lessonProgress },
    streak: updateStreak(state.progress.streak, toLocalDate(now)),
    activity: [
      activity(action.bonus ? "bonus" : "task", action.label, xp, timestamp),
      ...state.progress.activity,
    ].slice(0, ACTIVITY_LIMIT),
  };

  return { ...state, progress: addAchievements(progress, timestamp) };
}

function toLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function completeLesson(
  state: StoredApplicationState,
  action: Extract<ProgressAction, { type: "complete-lesson" }>,
): StoredApplicationState {
  const existing = state.progress.lessons[action.lesson.id];
  if (existing?.isCompleted) return state;
  const allTasksComplete = action.lesson.tasks.every((task) =>
    existing?.completedTaskIds.includes(task.id),
  );
  if (!allTasksComplete) return state;

  const now = action.now ?? new Date();
  const timestamp = now.toISOString();
  const lessonProgress = {
    lessonId: action.lesson.id,
    completedTaskIds: existing?.completedTaskIds ?? [],
    completedBonusTaskIds: existing?.completedBonusTaskIds ?? [],
    isCompleted: true,
    xpAwarded: (existing?.xpAwarded ?? 0) + action.lesson.xpReward,
    startedAt: existing?.startedAt ?? timestamp,
    completedAt: timestamp,
    updatedAt: timestamp,
  };
  const progress: UserProgress = {
    ...state.progress,
    totalXp: state.progress.totalXp + action.lesson.xpReward,
    lessons: { ...state.progress.lessons, [action.lesson.id]: lessonProgress },
    streak: updateStreak(state.progress.streak, toLocalDate(now)),
    activity: [
      activity(
        "lesson",
        `Fragment restored: ${action.lesson.title}`,
        action.lesson.xpReward,
        timestamp,
      ),
      ...state.progress.activity,
    ].slice(0, ACTIVITY_LIMIT),
  };
  return { ...state, progress: addAchievements(progress, timestamp) };
}

export function progressReducer(
  state: StoredApplicationState,
  action: ProgressAction,
): StoredApplicationState {
  switch (action.type) {
    case "record-task":
      return recordTask(state, action);
    case "complete-lesson":
      return completeLesson(state, action);
    case "set-name":
      return {
        ...state,
        progress: {
          ...state.progress,
          displayName: action.displayName.trim().slice(0, 60) || "Archive Operator",
        },
      };
    case "set-editor-font-size":
      return {
        ...state,
        preferences: {
          ...state.preferences,
          editorFontSize: Math.max(12, Math.min(22, Math.round(action.size))),
        },
      };
    case "set-hints-expanded":
      return {
        ...state,
        preferences: { ...state.preferences, hintsExpanded: action.expanded },
      };
    case "import":
      return action.state;
    case "reset":
      return structuredClone(defaultStoredState);
  }
}

export function getAchievementById(id: string) {
  return achievements.find((achievement) => achievement.id === id);
}
