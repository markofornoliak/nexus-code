import { achievements } from "../../content/achievements";
import { getOrderedLessons, tracks } from "../../content/registry";
import type {
  Achievement,
  AchievementCondition,
  Track,
  TrackProgress,
  UserProgress,
  WorldProgress,
} from "../../types";

export function completedTaskCount(progress: UserProgress): number {
  return Object.values(progress.lessons).reduce(
    (total, lesson) => total + lesson.completedTaskIds.length,
    0,
  );
}

export function completedBonusCount(progress: UserProgress): number {
  return Object.values(progress.lessons).reduce(
    (total, lesson) => total + lesson.completedBonusTaskIds.length,
    0,
  );
}

export function completedLessonCount(progress: UserProgress): number {
  return Object.values(progress.lessons).filter((lesson) => lesson.isCompleted).length;
}

export function selectWorldProgress(
  track: Track,
  worldId: string,
  progress: UserProgress,
): WorldProgress {
  const world = track.worlds.find((candidate) => candidate.id === worldId);
  const totalLessons =
    world?.lessons.filter((lesson) => lesson.status === "available").length ?? 0;
  const completedLessons =
    world?.lessons.filter((lesson) => progress.lessons[lesson.id]?.isCompleted).length ??
    0;
  const percent =
    totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
  return {
    worldId,
    completedLessons,
    totalLessons,
    percent,
    isCompleted: totalLessons > 0 && completedLessons === totalLessons,
  };
}

export function selectTrackProgress(track: Track, progress: UserProgress): TrackProgress {
  const worlds = track.worlds.map((world) =>
    selectWorldProgress(track, world.id, progress),
  );
  const totalLessons = getOrderedLessons(track).filter(
    (lesson) => lesson.status === "available",
  ).length;
  const completedLessons = getOrderedLessons(track).filter(
    (lesson) => progress.lessons[lesson.id]?.isCompleted,
  ).length;
  return {
    trackId: track.id,
    completedLessons,
    totalLessons,
    percent: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100),
    isCompleted: totalLessons > 0 && completedLessons === totalLessons,
    worlds,
  };
}

function conditionMet(condition: AchievementCondition, progress: UserProgress): boolean {
  switch (condition.type) {
    case "task-count":
      return completedTaskCount(progress) >= condition.count;
    case "lesson-count":
      return completedLessonCount(progress) >= condition.count;
    case "bonus-count":
      return completedBonusCount(progress) >= condition.count;
    case "total-xp":
      return progress.totalXp >= condition.amount;
    case "streak":
      return progress.streak.currentStreak >= condition.days;
    case "lesson-completed":
      return progress.lessons[condition.lessonId]?.isCompleted === true;
    case "world-completed": {
      const track = tracks.find((candidate) => candidate.id === condition.trackId);
      return track
        ? selectWorldProgress(track, condition.worldId, progress).isCompleted
        : false;
    }
    case "track-completed": {
      const track = tracks.find((candidate) => candidate.id === condition.trackId);
      return track ? selectTrackProgress(track, progress).isCompleted : false;
    }
  }
}

export function newlyUnlockedAchievements(
  progress: UserProgress,
  catalog: Achievement[] = achievements,
): Achievement[] {
  const unlocked = new Set(progress.unlockedAchievementIds);
  return catalog.filter(
    (achievement) =>
      !unlocked.has(achievement.id) && conditionMet(achievement.condition, progress),
  );
}

export function isLessonUnlocked(
  track: Track,
  lessonId: string,
  progress: UserProgress,
): boolean {
  const ordered = getOrderedLessons(track);
  const index = ordered.findIndex((lesson) => lesson.id === lessonId);
  if (index <= 0) return index === 0;
  const previous = ordered[index - 1];
  return previous ? progress.lessons[previous.id]?.isCompleted === true : false;
}
