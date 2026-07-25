import { defaultStoredState, STORAGE_KEY } from "./schema";
import {
  exportStoredState,
  importStoredState,
  loadStoredState,
  saveStoredState,
} from "./storage";

describe("versioned local storage", () => {
  it("serializes and loads validated state", () => {
    const state = structuredClone(defaultStoredState);
    state.progress.totalXp = 275;
    expect(saveStoredState(state)).toBe(true);
    expect(loadStoredState().state.progress.totalXp).toBe(275);
  });

  it("recovers from corrupted JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{broken");
    const loaded = loadStoredState();
    expect(loaded.recoveredFromCorruption).toBe(true);
    expect(loaded.state.progress.totalXp).toBe(0);
  });

  it("validates progress imports and rejects executable-shaped junk", () => {
    const serialized = exportStoredState(defaultStoredState);
    expect(importStoredState(serialized)?.version).toBe(2);
    expect(importStoredState('{"version":2,"progress":"alert(1)"}')).toBeNull();
  });
});
