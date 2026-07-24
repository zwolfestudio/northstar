import type { Mission } from "../models/mission";
import type { Project } from "../models/project";
import type { Note } from "../models/note";

function matches(query: string, ...fields: (string | undefined)[]): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return fields.some((field) => field?.toLowerCase().includes(q));
}

export function searchMissions(missions: Mission[], query: string): Mission[] {
  return missions.filter((mission) =>
    matches(query, mission.title, mission.category, mission.description, mission.nextAction)
  );
}

export function searchProjects(projects: Project[], query: string): Project[] {
  return projects.filter((project) => matches(query, project.title, project.notes));
}

export function searchNotes(notes: Note[], query: string): Note[] {
  return notes.filter((note) => matches(query, note.title, note.body));
}
