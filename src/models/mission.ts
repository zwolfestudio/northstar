import { createId } from "../utils/id";

export type MissionStatus = "Planning" | "Active" | "On Hold" | "Completed";
export type Priority = "Low" | "Medium" | "High" | "Critical";

export type Mission = {
  id: string;
  title: string;
  category: string;
  description?: string;
  status: MissionStatus;
  progress: number;
  priority: Priority;
  nextAction?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

const STATUS_VALUES: MissionStatus[] = ["Planning", "Active", "On Hold", "Completed"];
const PRIORITY_VALUES: Priority[] = ["Low", "Medium", "High", "Critical"];

/**
 * Fills in missing fields on records saved by older versions of Northstar
 * (e.g. pre-v0.2 missions had no id/timestamps).
 */
export function normalizeMissions(raw: unknown[]): Mission[] {
  const now = new Date().toISOString();

  return raw.map((entry) => {
    const partial = entry as Partial<Mission>;

    return {
      id: partial.id ?? createId(),
      title: partial.title ?? "Untitled Mission",
      category: partial.category ?? "General",
      description: partial.description,
      status: STATUS_VALUES.includes(partial.status as MissionStatus)
        ? (partial.status as MissionStatus)
        : "Active",
      progress: typeof partial.progress === "number" ? partial.progress : 0,
      priority: PRIORITY_VALUES.includes(partial.priority as Priority)
        ? (partial.priority as Priority)
        : "Medium",
      nextAction: partial.nextAction,
      createdAt: partial.createdAt ?? now,
      updatedAt: partial.updatedAt ?? now,
      completedAt: partial.completedAt,
    };
  });
}
