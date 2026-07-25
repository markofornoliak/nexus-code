import {
  getAdjacentLessons,
  getLesson,
  getOrderedLessons,
  getTrack,
  tracks,
} from "./registry";

describe("content registry", () => {
  it("discovers all five language modules", () => {
    expect(tracks.map((track) => track.id)).toEqual([
      "python",
      "javascript",
      "html-css",
      "java",
      "cpp",
    ]);
  });

  it("assembles three Python worlds and fifteen lessons", () => {
    const python = getTrack("python");
    expect(python?.worlds).toHaveLength(3);
    expect(python && getOrderedLessons(python)).toHaveLength(15);
    expect(python?.worlds.every((world) => world.lessons.length === 5)).toBe(true);
  });

  it("looks up lessons and adjacency without route-specific switches", () => {
    const entry = getLesson("python", "python-variables");
    expect(entry?.world.id).toBe("signal-awakening");
    expect(entry?.lesson.title).toBe("Signal Vessels");
    const adjacent = entry && getAdjacentLessons(entry.track, entry.lesson.id);
    expect(adjacent?.previous?.id).toBe("python-first-signal");
    expect(adjacent?.next?.id).toBe("python-strings");
  });
});
