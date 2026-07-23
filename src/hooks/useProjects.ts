import useCollection from "./useCollection";
import { projects as seedProjects } from "../data/projects";
import type { Project } from "../models/project";

function useProjects() {
  return useCollection<Project>("northstar-projects", seedProjects);
}

export default useProjects;
