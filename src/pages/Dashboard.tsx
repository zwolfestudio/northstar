import { useState } from "react";
import { missions as seedMissions } from "../data/missions";
import { projects as seedProjects } from "../data/projects";
import MissionCard from "../components/cards/MissionCard";
import ProjectCard from "../components/cards/ProjectCard";
import useCollection from "../hooks/useCollection";
import { normalizeMissions, type Mission } from "../models/mission";
import type { Project } from "../models/project";
import { createId } from "../utils/id";

function Dashboard() {
  const {
    items: missions,
    addItem: addMission,
    updateItem: updateMission,
  } = useCollection<Mission>("northstar-missions", seedMissions, normalizeMissions);

  const { items: projects } = useCollection<Project>("northstar-projects", seedProjects);

  const [newTitle, setNewTitle] = useState("");

  const activeMissions = missions.filter((mission) => mission.status !== "Completed");
  const completedMissions = missions.filter((mission) => mission.status === "Completed");

  const missionTitleById = (id?: string) =>
    id ? missions.find((mission) => mission.id === id)?.title : undefined;

  const handleAddMission = () => {
    const title = newTitle.trim();
    if (!title) return;

    const now = new Date().toISOString();
    addMission({
      id: createId(),
      title,
      category: "General",
      status: "Planning",
      progress: 0,
      priority: "Medium",
      createdAt: now,
      updatedAt: now,
    });
    setNewTitle("");
  };

  return (
    <div>
      <h1>Good afternoon.</h1>
      <p>Your mission briefing awaits.</p>

      <div className="dashboard-grid">
        <section className="card">
          <h2>🎯 Active Missions</h2>

          <div className="add-mission">
            <input
              className="mission-input"
              placeholder="New mission title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddMission()}
            />
            <button onClick={handleAddMission}>Add Mission</button>
          </div>

          {activeMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} onUpdate={updateMission} />
          ))}
        </section>

        <section className="card">
          <h2>⚡ Current Projects</h2>

          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              missionTitle={missionTitleById(project.missionId)}
            />
          ))}
        </section>

        <section className="card">
          <h2>📌 Today's Focus</h2>
          <p>No priorities assigned.</p>
        </section>

        <section className="card">
          <h2>🌌 Observatory</h2>
          <p>Weather and astronomy modules will appear here.</p>
        </section>

        {completedMissions.length > 0 && (
          <section className="card">
            <h2>✅ Recently Completed</h2>
            <p className="hint">
              A dedicated Finished page is coming soon — for now, completed missions show
              here.
            </p>

            {completedMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} onUpdate={updateMission} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
