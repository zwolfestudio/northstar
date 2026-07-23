import { useState } from "react";
import { loadValue, saveValue } from "../services/storage";

type TrackedItems = {
  missionId: string | null;
  projectId: string | null;
};

const STORAGE_KEY = "northstar-dashboard-tracked";
const DEFAULT_TRACKED: TrackedItems = { missionId: null, projectId: null };

function useTrackedItems() {
  const [tracked, setTracked] = useState<TrackedItems>(() =>
    loadValue<TrackedItems>(STORAGE_KEY, DEFAULT_TRACKED)
  );

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
