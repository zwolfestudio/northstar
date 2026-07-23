import { Link } from "react-router-dom";
import MissionCard from "../components/cards/MissionCard";
import ProjectCard from "../components/cards/ProjectCard";
import useMissions from "../hooks/useMissions";
import useProjects from "../hooks/useProjects";

const SUMMARY_COUNT = 3;

function Dashboard() {
  const { items: missions } = useMissions();
  const { items: projects } = useProjects();

  const activeMissions = missions
    .filter((mission) => mission.status !== "Completed")
    .slice(0, SUMMARY_COUNT);

  const activeProjects = projects
    .filter((project) => project.status !== "Completed")
    .slice(0, SUMMARY_COUNT);

  const missionTitleById = (id?: string) =>
    id ? missions.find((mission) => mission.id === id)?.title : undefined;

  return (
    <div>
      <h1>Good afternoon.</h1>
      <p>Your mission briefing awaits.</p>

      <div className="dashboard-grid">
        <section className="card">
          <div className="section-header">
            <h2>🎯 Active Missions</h2>
            <Link to="/missions">View all →</Link>
          </div>

          {activeMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} readOnly />
          ))}

          {activeMissions.length === 0 && <p className="hint">No active missions.</p>}
        </section>

        <section className="card">
          <div className="section-header">
            <h2>⚡ Current Projects</h2>
            <Link to="/projects">View all →</Link>
          </div>

          {activeProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              missionTitle={missionTitleById(project.missionId)}
            />
          ))}

          {activeProjects.length === 0 && <p className="hint">No active projects.</p>}
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
