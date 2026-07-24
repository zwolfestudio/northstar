import { describe, expect, it } from "vitest";
import { getStaleness, getSuggestion, getRecentGrowth, STALE_DAYS } from "./briefing";
import type { Mission } from "../models/mission";
import type { Project } from "../models/project";

const now = new Date();

function daysAgo(n: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function makeMission(overrides: Partial<Mission>): Mission {
  return {
    id: "mission-1",
    title: "Test Mission",
    category: "Test",
    status: "Active",
    progress: 10,
    priority: "Medium",
    createdAt: daysAgo(30),
    updatedAt: daysAgo(0),
    ...overrides,
  };
}

function makeProject(overrides: Partial<Project>): Project {
  return {
    id: "project-1",
    title: "Test Project",
    missionId: "mission-1",
    tasks: [],
    progress: 0,
    status: "Active",
    createdAt: daysAgo(30),
    updatedAt: daysAgo(0),
    ...overrides,
  };
}

describe("getStaleness", () => {
  it("is not stale when updated recently", () => {
    const mission = makeMission({ updatedAt: daysAgo(1) });
    expect(getStaleness(mission).isStale).toBe(false);
  });

  it("is stale once STALE_DAYS have passed", () => {
    const mission = makeMission({ updatedAt: daysAgo(STALE_DAYS) });
    expect(getStaleness(mission).isStale).toBe(true);
  });
});

describe("getSuggestion", () => {
  it("suggests revisiting a stale focus mission first", () => {
    const stale = makeMission({ id: "m1", title: "Stale Focus", updatedAt: daysAgo(10) });
    const result = getSuggestion(stale, [stale], []);
    expect(result?.text).toContain("Stale Focus");
  });

  it("suggests a linked project with open tasks when the focus mission is fresh", () => {
    const fresh = makeMission({ id: "m1", title: "Fresh Focus", updatedAt: daysAgo(0) });
    const project = makeProject({
      missionId: "m1",
      title: "Has Open Tasks",
      tasks: [
        { id: "t1", title: "Do the thing", done: false },
        { id: "t2", title: "Done already", done: true },
      ],
    });
    const result = getSuggestion(fresh, [fresh], [project]);
    expect(result?.text).toContain("Has Open Tasks");
    expect(result?.reason).toContain("1 task");
  });

  it("falls back to any other stalled mission when focus is fine and has no open tasks", () => {
    const fresh = makeMission({ id: "m1", title: "Fresh Focus", updatedAt: daysAgo(0) });
    const stalled = makeMission({ id: "m2", title: "Forgotten Mission", updatedAt: daysAgo(20) });
    const result = getSuggestion(fresh, [fresh, stalled], []);
    expect(result?.text).toContain("Forgotten Mission");
  });

  it("returns null when there is nothing to suggest", () => {
    const fresh = makeMission({ id: "m1", updatedAt: daysAgo(0) });
    expect(getSuggestion(fresh, [fresh], [])).toBeNull();
  });

  it("returns null with no focus mission and nothing stalled", () => {
    expect(getSuggestion(undefined, [], [])).toBeNull();
  });
});

describe("getRecentGrowth", () => {
  it("returns the most recently completed mission", () => {
    const older = makeMission({ id: "m1", title: "Older", status: "Completed", completedAt: daysAgo(5) });
    const newer = makeMission({ id: "m2", title: "Newer", status: "Completed", completedAt: daysAgo(1) });
    expect(getRecentGrowth([older, newer])?.title).toBe("Newer");
  });

  it("ignores missions without a completedAt even if marked Completed", () => {
    const noTimestamp = makeMission({ status: "Completed", completedAt: undefined });
    expect(getRecentGrowth([noTimestamp])).toBeUndefined();
  });

  it("returns undefined when nothing is completed", () => {
    const active = makeMission({ status: "Active" });
    expect(getRecentGrowth([active])).toBeUndefined();
  });
});
