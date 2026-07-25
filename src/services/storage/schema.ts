import type {
  LearningActivity,
  LessonProgress,
  StoredApplicationState,
  UserPreferences,
  UserProgress,
} from "../../types";
import { sanitizeStreak } from "../../lib/date";

export const STORAGE_VERSION = 2;
export const STORAGE_KEY = "nexus-code:state";

export const defaultProgress: UserProgress = {
  displayName: "Archive Operator",
  totalXp: 0,
  lessons: {},
  unlockedAchievementIds: [],
  achievementDates: {},
  streak: {
    lastActiveDate: null,
    currentStreak: 0,
    longestStreak: 0,
    countedToday: false,
  },
  activity: [],
};

export const defaultPreferences: UserPreferences = {
  reducedMotion: false,
  editorFontSize: 14,
  hintsExpanded: false,
};

export const defaultStoredState: StoredApplicationState = {
  version: STORAGE_VERSION,
  progress: defaultProgress,
  preferences: defaultPreferences,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").slice(0, 500)
    : [];
}

function safeString(value: unknown, fallback = "", maxLength = 160): string {
  return typeof value === "string" ? value.slice(0, maxLength) : fallback;
}

function safeInteger(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : fallback;
}

function parseLessonProgress(value: unknown, lessonId: string): LessonProgress | null {
  if (!isRecord(value)) return null;
  const startedAt = safeString(value.startedAt, new Date(0).toISOString(), 40);
  const updatedAt = safeString(value.updatedAt, startedAt, 40);
  const completedAt = safeString(value.completedAt, "", 40);
  return {
    lessonId,
    completedTaskIds: stringArray(value.completedTaskIds),
    completedBonusTaskIds: stringArray(value.completedBonusTaskIds),
    isCompleted: value.isCompleted === true,
    xpAwarded: safeInteger(value.xpAwarded),
    startedAt,
    updatedAt,
    ...(completedAt ? { completedAt } : {}),
  };
}

function parseActivity(value: unknown): LearningActivity[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((item): LearningActivity => {
      const activityType: LearningActivity["type"] =
        item.type === "task" ||
        item.type === "bonus" ||
        item.type === "lesson" ||
        item.type === "achievement"
          ? item.type
          : "task";
      return {
        id: safeString(item.id, `recovered-${Math.random().toString(36).slice(2)}`, 120),
        type: activityType,
        label: safeString(item.label, "Recovered activity", 160),
        xp: safeInteger(item.xp),
        occurredAt: safeString(item.occurredAt, new Date(0).toISOString(), 40),
      };
    })
    .slice(0, 30);
}

function parseProgress(value: unknown): UserProgress | null {
  if (!isRecord(value)) return null;
  const rawLessons = isRecord(value.lessons) ? value.lessons : {};
  const lessons = Object.fromEntries(
    Object.entries(rawLessons)
      .slice(0, 500)
      .map(([lessonId, raw]) => [lessonId, parseLessonProgress(raw, lessonId)])
      .filter((entry): entry is [string, LessonProgress] => entry[1] !== null),
  );
  const rawAchievementDates = isRecord(value.achievementDates)
    ? value.achievementDates
    : {};
  const achievementDates = Object.fromEntries(
    Object.entries(rawAchievementDates)
      .filter((entry): entry is [string, string] => typeof entry[1] === "string")
      .slice(0, 100),
  );

  return {
    displayName: safeString(value.displayName, defaultProgress.displayName, 60),
    totalXp: safeInteger(value.totalXp),
    lessons,
    unlockedAchievementIds: stringArray(value.unlockedAchievementIds).slice(0, 100),
    achievementDates,
    streak: sanitizeStreak(isRecord(value.streak) ? value.streak : undefined),
    activity: parseActivity(value.activity),
  };
}

function parsePreferences(value: unknown): UserPreferences {
  if (!isRecord(value)) return defaultPreferences;
  const editorFontSize = safeInteger(
    value.editorFontSize,
    defaultPreferences.editorFontSize,
  );
  return {
    reducedMotion: value.reducedMotion === true,
    editorFontSize: Math.min(22, Math.max(12, editorFontSize)),
    hintsExpanded: value.hintsExpanded === true,
  };
}

function migrate(raw: Record<string, unknown>): Record<string, unknown> {
  const version = safeInteger(raw.version, 1);
  if (version === 1) {
    return {
      ...raw,
      version: 2,
      preferences: isRecord(raw.preferences)
        ? { hintsExpanded: false, ...raw.preferences }
        : defaultPreferences,
    };
  }
  return raw;
}

export function validateStoredState(value: unknown): StoredApplicationState | null {
  if (!isRecord(value)) return null;
  const migrated = migrate(value);
  if (migrated.version !== STORAGE_VERSION) return null;
  const progress = parseProgress(migrated.progress);
  if (!progress) return null;
  return {
    version: STORAGE_VERSION,
    progress,
    preferences: parsePreferences(migrated.preferences),
  };
}
