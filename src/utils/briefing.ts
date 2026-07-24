import type { Mission } from "../models/mission";
import type { Project } from "../models/project";
import { getProjectsForMission } from "./relations";

export const STALE_DAYS = 7;

export type Suggestion = {
  text: string;
  reason: string;
};

function daysSince(isoDate: string): number {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function getStaleness(mission: Mission): { isStale: boolean; days: number } {
  const days = daysSince(mission.updatedAt);
  return { isStale: days >= STALE_DAYS, days };
}

/**
 * One deterministic recommendation, in priority order:
 * 1. The focus Mission itself, if it's gone stale.
 * 2. A Project linked to the focus Mission with open tasks.
 * 3. Any other active Mission that's gone stale.
 * Returns null when nothing needs attention.
 */
export function getSuggestion(
  focusMission: Mission | undefined,
  missions: Mission[],
  projects: Project[]
): Suggestion | null {
  if (focusMission) {
    const { isStale, days } = getStaleness(focusMission);
    if (isStale) {
      return {
        text: `Revisit "${focusMission.title}"`,
        reason: `Last updated ${days} day${days === 1 ? "" : "s"} ago`,
      };
    }

    const projectWithOpenTasks = getProjectsForMission(projects, focusMission.id).find(
      (project) => project.tasks.some((task) => !task.done)
    );

    if (projectWithOpenTasks) {
      const openCount = projectWithOpenTasks.tasks.filter((task) => !task.done).length;
      return {
        text: `Review unfinished tasks in "${projectWithOpenTasks.title}"`,
        reason: `${openCount} task${openCount === 1 ? "" : "s"} still open`,
      };
    }
  }

  const stalledMission = missions
    .filter((mission) => mission.status !== "Completed")
    .find((mission) => getStaleness(mission).isStale);

  if (stalledMission) {
    const { days } = getStaleness(stalledMission);
    return {
      text: `Revisit "${stalledMission.title}"`,
      reason: `Last updated ${days} day${days === 1 ? "" : "s"} ago`,
    };
  }

  return null;
}

/**
 * Most recently completed Mission. Projects don't have a completedAt
 * field yet, so they're not part of this comparison - adding one is a
 * small future enhancement, not guessed at here.
 */
export function getRecentGrowth(missions: Mission[]): Mission | undefined {
  return [...missions]
    .filter((mission): mission is Mission & { completedAt: string } =>
      mission.status === "Completed" && Boolean(mission.completedAt)
    )
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
}
