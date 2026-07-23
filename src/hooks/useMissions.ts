import useCollection from "./useCollection";
import { missions as seedMissions } from "../data/missions";
import { normalizeMissions, type Mission } from "../models/mission";

function useMissions() {
  return useCollection<Mission>("northstar-missions", seedMissions, normalizeMissions);
}

export default useMissions;
