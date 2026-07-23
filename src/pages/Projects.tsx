import ProjectCard from "../components/cards/ProjectCard";
import useMissions from "../hooks/useMissions";
import useProjects from "../hooks/useProjects";
import useTrackedItems from "../hooks/useTrackedItems";

function Projects() {
  const { items: missions } = useMissions();
  const { items: projects } = useProjects();
  const { tracked, trackProject } = useTrackedItems();

  const missionTitleById = (id?: string) =>
    id ? missions.find((mission) => mission.id === id)?.title : undefined;

  return (
    <div>
      <h1>Projects</h1>
      <p>Concrete efforts in motion.</p>

      <div className="page-list">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            missionTitle={missionTitleById(project.missionId)}
            onTrack={() => trackProject(project.id)}
            isTracked={tracked.projectId === project.id}
          />
        ))}
      </div>

      {projects.length === 0 && <p className="hint">No projects yet.</p>}
    </div>
  );
}

export default Projects;
