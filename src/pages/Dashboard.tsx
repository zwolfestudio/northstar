import { Link } from "react-router-dom";
import MissionCard from "../components/cards/MissionCard";
import ProjectCard from "../components/cards/ProjectCard";
import useMissions from "../hooks/useMissions";
import useProjects from "../hooks/useProjects";
import useTrackedItems from "../hooks/useTrackedItems";

function Dashboard() {
  const { items: missions } = useMissions();
  const { items: projects } = useProjects();
  const { tracked } = useTrackedItems();

  const activeMissions = missions.filter((mission) => mission.status !== "Completed");
  const activeProjects = projects.filter((project) => project.status !== "Completed");

  const trackedMission =
    activeMissions.find((mission) => mission.id === tracked.missionId) ?? activeMissions[0];

  const trackedProject =
    activeProjects.find((project) => project.id === tracked.projectId) ?? activeProjects[0];

  const missionTitleById = (id?: string) =>
    id ? missions.find((mission) => mission.id === id)?.title : undefined;

  return (
    <div className="dashboard-page">
      <h1>Good afternoon.</h1>
      <p>Your mission briefing awaits.</p>

      <div className="dashboard-grid">
        <section className="card">
          <div className="section-header">
            <h2>🎯 Tracked Mission</h2>
            <Link to="/missions">View all →</Link>
          </div>

          {trackedMission ? (
            <MissionCard mission={trackedMission} readOnly />
          ) : (
            <p className="hint">No active missions.</p>
          )}
        </section>

        <section className="card">
          <div className="section-header">
            <h2>⚡ Tracked Project</h2>
            <Link to="/projects">View all →</Link>
          </div>

          {trackedProject ? (
            <ProjectCard
              project={trackedProject}
              missionTitle={missionTitleById(trackedProject.missionId)}
              readOnly
            />
          ) : (
            <p className="hint">No active projects.</p>
          )}
        </section>

        <section className="card">
          <h2>📌 Today's Focus</h2>
          <p>No priorities assigned.</p>
        </section>

        <section className="card">
          <h2>🌌 Observatory</h2>
          <p>Weather and astronomy modules will appear here.</p>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
