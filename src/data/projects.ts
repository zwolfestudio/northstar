import type { Project } from "../models/project";
import { missions } from "./missions";
import { createId } from "../utils/id";

const now = new Date().toISOString();

function missionId(title: string): string | undefined {
  return missions.find((mission) => mission.title === title)?.id;
}

export const projects: Project[] = [
  {
    id: createId(),
    title: "Build first dashboard shell",
    missionId: missionId("Build Northstar"),
    tasks: [],
    progress: 100,
    status: "Completed",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createId(),
    title: "Create mission tracking system",
    missionId: missionId("Build Northstar"),
    tasks: [],
    progress: 75,
    status: "Active",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createId(),
    title: "Design staff inventory tracker",
    missionId: missionId("Staff Making Project"),
    tasks: [],
    progress: 25,
    status: "Planning",
    createdAt: now,
    updatedAt: now,
  },
];
