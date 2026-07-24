import { useState } from "react";
import { loadValue, saveValue } from "../services/storage";

type TrackedItems = {
  missionId: string | null;
  projectId: string | null;
};

const STORAGE_KEY = "northstar-spotlight";
const LEGACY_STORAGE_KEY = "northstar-dashboard-tracked";
const DEFAULT_TRACKED: TrackedItems = { missionId: null, projectId: null };

/**
 * One-time migration from the old key name. "Dashboard-tracked" named
 * the concept after the one screen that happened to read it; "spotlight"
 * names what it actually is, since Missions/Projects pages write to it
 * too.
 */
function loadTracked(): TrackedItems {
  const current = loadValue<TrackedItems | null>(STORAGE_KEY, null);
  if (current) return current;

  const legacy = loadValue<TrackedItems | null>(LEGACY_STORAGE_KEY, null);
  if (legacy) {
    saveValue(STORAGE_KEY, legacy);
    return legacy;
  }

  return DEFAULT_TRACKED;
}

function useTrackedItems() {
  const [tracked, setTracked] = useState<TrackedItems>(loadTracked);

  const trackMission = (missionId: string) => {
    const next = { ...tracked, missionId };
    setTracked(next);
    saveValue(STORAGE_KEY, next);
  };

  const trackProject = (projectId: string) => {
    const next = { ...tracked, projectId };
    setTracked(next);
    saveValue(STORAGE_KEY, next);
  };

  return { tracked, trackMission, trackProject };
}

export default useTrackedItems;
