import { useState } from "react";
import ProjectCard from "../components/cards/ProjectCard";
import useMissions from "../hooks/useMissions";
import useProjects from "../hooks/useProjects";
import useTrackedItems from "../hooks/useTrackedItems";
import { createId } from "../utils/id";

function Projects() {
  const { items: missions } = useMissions();
  const { items: projects, addItem: addProject, updateItem: updateProject } = useProjects();
  const { tracked, trackProject } = useTrackedItems();
  const [newTitle, setNewTitle] = useState("");
  const [newMissionId, setNewMissionId] = useState("");

  const missionTitleById = (id?: string) =>
    id ? missions.find((mission) => mission.id === id)?.title : undefined;

  const handleAddProject = () => {
    const title = newTitle.trim();
    if (!title) return;

    const now = new Date().toISOString();
    addProject({
      id: createId(),
      title,
      missionId: newMissionId || undefined,
      tasks: [],
      progress: 0,
      status: "Planning",
      createdAt: now,
      updatedAt: now,
    });
    setNewTitle("");
    setNewMissionId("");
  };

  return (
    <div>
      <h1>Projects</h1>
      <p>Concrete efforts in motion.</p>

      <div className="add-mission">
        <input
          className="mission-input"
          placeholder="New project title..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddProject()}
        />

        <select
          className="mission-input"
          value={newMissionId}
          onChange={(e) => setNewMissionId(e.target.value)}
        >
          <option value="">No mission</option>
          {missions.map((mission) => (
            <option key={mission.id} value={mission.id}>
              {mission.title}
            </option>
          ))}
        </select>

        <button onClick={handleAddProject}>Add Project</button>
      </div>

      <div className="page-list">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            missionTitle={missionTitleById(project.missionId)}
            missions={missions}
            onUpdate={updateProject}
            onTrack={() => trackProject(project.id)}
            isTracked={tracked.projectId === project.id}
          />
        ))}
      </div>

      {projects.length === 0 && <p className="hint">No projects yet. Add one above.</p>}
    </div>
  );
}

export default Projects;
