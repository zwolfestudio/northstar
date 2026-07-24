import { Link } from "react-router-dom";
import MissionCard from "../components/cards/MissionCard";
import ProjectCard from "../components/cards/ProjectCard";
import useMissions from "../hooks/useMissions";
import useProjects from "../hooks/useProjects";
import useTrackedItems from "../hooks/useTrackedItems";
import { getSuggestion, getRecentGrowth } from "../utils/briefing";

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

  const suggestion = getSuggestion(trackedMission, missions, projects);
  const recentGrowth = getRecentGrowth(missions);
  const hasBriefingContent = trackedMission || suggestion || recentGrowth;

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
          <h2>🧭 Daily Briefing</h2>

          {trackedMission && (
            <div className="briefing-item">
              <span className="briefing-label">Focus</span>
              <p>{trackedMission.title}</p>
            </div>
          )}

          {suggestion && (
            <div className="briefing-item">
              <span className="briefing-label">Suggested</span>
              <p>{suggestion.text}</p>
              <p className="hint">{suggestion.reason}</p>
            </div>
          )}

          {!suggestion && trackedMission && (
            <div className="briefing-item">
              <span className="briefing-label">Suggested</span>
              <p className="hint">Nothing stalled — steady progress.</p>
            </div>
          )}

          {recentGrowth && (
            <div className="briefing-item">
              <span className="briefing-label">Recent Growth</span>
              <p>Completed "{recentGrowth.title}"</p>
            </div>
          )}

          {!hasBriefingContent && (
            <p className="hint">Add a mission to get your first briefing.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
