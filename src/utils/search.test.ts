import { describe, expect, it } from "vitest";
import { searchMissions, searchProjects, searchNotes } from "./search";
import type { Mission } from "../models/mission";
import type { Project } from "../models/project";
import type { Note } from "../models/note";

const now = new Date().toISOString();

const missions: Mission[] = [
  {
    id: "m1",
    title: "Build Northstar",
    category: "Development",
    description: "A personal command center",
    status: "Active",
    progress: 20,
    priority: "Critical",
    nextAction: "Ship v0.3.3",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "m2",
    title: "Staff Making Project",
    category: "Craft",
    status: "Active",
    progress: 25,
    priority: "Medium",
    createdAt: now,
    updatedAt: now,
  },
];

const projects: Project[] = [
  {
    id: "p1",
    title: "Design staff inventory tracker",
    missionId: "m2",
    notes: "Needs a wood-type dropdown",
    tasks: [],
    progress: 25,
    status: "Planning",
    createdAt: now,
    updatedAt: now,
  },
];

const notes: Note[] = [
  {
    id: "n1",
    title: "Finishing techniques",
    body: "Tung oil works well on maple",
    createdAt: now,
    updatedAt: now,
  },
];

describe("searchMissions", () => {
  it("matches on title", () => {
    expect(searchMissions(missions, "northstar")).toEqual([missions[0]]);
  });

  it("matches on description and nextAction", () => {
    expect(searchMissions(missions, "command center")).toEqual([missions[0]]);
    expect(searchMissions(missions, "v0.3.3")).toEqual([missions[0]]);
  });

  it("is case-insensitive", () => {
    expect(searchMissions(missions, "STAFF")).toEqual([missions[1]]);
  });

  it("returns nothing for a blank query", () => {
    expect(searchMissions(missions, "   ")).toEqual([]);
  });
});

describe("searchProjects", () => {
  it("matches on title and notes", () => {
    expect(searchProjects(projects, "inventory")).toEqual(projects);
    expect(searchProjects(projects, "wood-type")).toEqual(projects);
  });

  it("returns nothing when there's no match", () => {
    expect(searchProjects(projects, "nonexistent")).toEqual([]);
  });
});

describe("searchNotes", () => {
  it("matches on title and body", () => {
    expect(searchNotes(notes, "finishing")).toEqual(notes);
    expect(searchNotes(notes, "tung oil")).toEqual(notes);
  });
});
