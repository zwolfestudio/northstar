import MissionCard from "../components/cards/MissionCard";
import ProjectCard from "../components/cards/ProjectCard";
import useMissions from "../hooks/useMissions";
import useProjects from "../hooks/useProjects";

function Finished() {
  const { items: missions, updateItem: updateMission } = useMissions();
  const { items: projects } = useProjects();

  const completedMissions = missions.filter((mission) => mission.status === "Completed");
  const completedProjects = projects.filter((project) => project.status === "Completed");

  const missionTitleById = (id?: string) =>
    id ? missions.find((mission) => mission.id === id)?.title : undefined;

  return (
    <div>
      <h1>Finished</h1>
      <p>Everything you've already wrapped up.</p>

      <h2>Completed Missions</h2>
      {completedMissions.length === 0 && (
        <p className="hint">No completed missions yet.</p>
      )}
      <div className="page-list">
        {completedMissions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} onUpdate={updateMission} />
        ))}
      </div>

      <h2>Completed Projects</h2>
      {completedProjects.length === 0 && (
        <p className="hint">No completed projects yet.</p>
      )}
      <div className="page-list">
        {completedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            missionTitle={missionTitleById(project.missionId)}
          />
        ))}
      </div>
    </div>
  );
}

export default Finished;
