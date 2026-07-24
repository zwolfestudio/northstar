import { describe, expect, it } from "vitest";
import {
  getProjectsForMission,
  getNotesForMission,
  getNotesForProject,
  getMissionForProject,
} from "./relations";
import type { Mission } from "../models/mission";
import type { Project } from "../models/project";
import type { Note } from "../models/note";

const now = new Date().toISOString();

const missionA: Mission = {
  id: "mission-a",
  title: "Mission A",
  category: "Test",
  status: "Active",
  progress: 10,
  priority: "Medium",
  createdAt: now,
  updatedAt: now,
};

const missionB: Mission = { ...missionA, id: "mission-b", title: "Mission B" };

const projectLinked: Project = {
  id: "project-1",
  title: "Linked Project",
  missionId: "mission-a",
  tasks: [],
  progress: 0,
  status: "Active",
  createdAt: now,
  updatedAt: now,
};

const projectUnlinked: Project = { ...projectLinked, id: "project-2", title: "Unlinked", missionId: undefined };

const noteForMission: Note = {
  id: "note-1",
  title: "Mission Note",
  body: "",
  missionId: "mission-a",
  createdAt: now,
  updatedAt: now,
};

const noteForProject: Note = {
  id: "note-2",
  title: "Project Note",
  body: "",
  projectId: "project-1",
  createdAt: now,
  updatedAt: now,
};

const noteUnlinked: Note = { id: "note-3", title: "Unlinked Note", body: "", createdAt: now, updatedAt: now };

describe("getProjectsForMission", () => {
  it("returns only projects linked to the given mission", () => {
    const result = getProjectsForMission([projectLinked, projectUnlinked], "mission-a");
    expect(result).toEqual([projectLinked]);
  });

  it("returns an empty array when nothing links to the mission", () => {
    expect(getProjectsForMission([projectUnlinked], "mission-a")).toEqual([]);
  });
});

describe("getNotesForMission", () => {
  it("returns only notes linked to the given mission", () => {
    const result = getNotesForMission([noteForMission, noteForProject, noteUnlinked], "mission-a");
    expect(result).toEqual([noteForMission]);
  });
});

describe("getNotesForProject", () => {
  it("returns only notes linked to the given project", () => {
    const result = getNotesForProject([noteForMission, noteForProject, noteUnlinked], "project-1");
    expect(result).toEqual([noteForProject]);
  });
});

describe("getMissionForProject", () => {
  it("finds the mission a project links to", () => {
    expect(getMissionForProject([missionA, missionB], projectLinked)).toEqual(missionA);
  });

  it("returns undefined when the project has no mission link", () => {
    expect(getMissionForProject([missionA, missionB], projectUnlinked)).toBeUndefined();
  });
});
