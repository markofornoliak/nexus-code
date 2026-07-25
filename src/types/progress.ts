export interface LearningActivity {
  id: string;
  type: "task" | "bonus" | "lesson" | "achievement";
  label: string;
  xp: number;
  occurredAt: string;
}

export interface LessonProgress {
  lessonId: string;
  completedTaskIds: string[];
  completedBonusTaskIds: string[];
  isCompleted: boolean;
  xpAwarded: number;
  startedAt: string;
  completedAt?: string;
  updatedAt: string;
}

export interface WorldProgress {
  worldId: string;
  completedLessons: number;
  totalLessons: number;
  percent: number;
  isCompleted: boolean;
}

export interface TrackProgress {
  trackId: string;
  completedLessons: number;
  totalLessons: number;
  percent: number;
  isCompleted: boolean;
  worlds: WorldProgress[];
}

export interface StreakState {
  lastActiveDate: string | null;
  currentStreak: number;
  longestStreak: number;
  countedToday: boolean;
}

export interface UserProgress {
  displayName: string;
  totalXp: number;
  lessons: Record<string, LessonProgress>;
  unlockedAchievementIds: string[];
  achievementDates: Record<string, string>;
  streak: StreakState;
  activity: LearningActivity[];
}

export interface UserPreferences {
  reducedMotion: boolean;
  editorFontSize: number;
  hintsExpanded: boolean;
}

export interface StoredApplicationState {
  version: number;
  progress: UserProgress;
  preferences: UserPreferences;
}

export interface LevelProgress {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  percent: number;
}
