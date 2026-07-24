import type { Mission } from "../models/mission";
import type { Project } from "../models/project";
import type { Note } from "../models/note";

export function getProjectsForMission(projects: Project[], missionId: string): Project[] {
  return projects.filter((project) => project.missionId === missionId);
}

export function getNotesForMission(notes: Note[], missionId: string): Note[] {
  return notes.filter((note) => note.missionId === missionId);
}

export function getNotesForProject(notes: Note[], projectId: string): Note[] {
  return notes.filter((note) => note.projectId === projectId);
}

export function getMissionForProject(missions: Mission[], project: Project): Mission | undefined {
  return missions.find((mission) => mission.id === project.missionId);
}
