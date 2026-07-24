import { useState } from "react";
import { Link } from "react-router-dom";
import type { Project, ProjectStatus } from "../../models/project";
import type { Mission } from "../../models/mission";
import { createId } from "../../utils/id";

type Props = {
  project: Project;
  missionTitle?: string;
  missions?: Mission[];
  onUpdate?: (id: string, updates: Partial<Project>) => void;
  onTrack?: () => void;
  isTracked?: boolean;
  readOnly?: boolean;
};

const STATUS_OPTIONS: ProjectStatus[] = ["Planning", "Active", "On Hold", "Completed"];

function ProjectCard({
  project,
  missionTitle,
  missions,
  onUpdate,
  onTrack,
  isTracked = false,
  readOnly = false,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(project);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const startEditing = () => {
    setDraft(project);
    setIsEditing(true);
  };

  const saveEditing = () => {
    onUpdate?.(project.id, {
      title: draft.title,
      missionId: draft.missionId,
      status: draft.status,
      notes: draft.notes,
    });
    setIsEditing(false);
  };

  const completeProject = () => {
    onUpdate?.(project.id, { status: "Completed", progress: 100 });
  };

  const increaseProgress = () => {
    onUpdate?.(project.id, { progress: Math.min(project.progress + 5, 100) });
  };

  const addTask = () => {
    const title = newTaskTitle.trim();
    if (!title) return;
    onUpdate?.(project.id, {
      tasks: [...project.tasks, { id: createId(), title, done: false }],
    });
    setNewTaskTitle("");
  };

  const toggleTask = (taskId: string) => {
    onUpdate?.(project.id, {
      tasks: project.tasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      ),
    });
  };

  const removeTask = (taskId: string) => {
    onUpdate?.(project.id, {
      tasks: project.tasks.filter((task) => task.id !== taskId),
    });
  };

  if (isEditing) {
    return (
      <div className="objective-card mission-card-editing">
        <input
          className="mission-input"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />

        {missions && (
          <select
            className="mission-input"
            value={draft.missionId ?? ""}
            onChange={(e) => setDraft({ ...draft, missionId: e.target.value || undefined })}
          >
            <option value="">No mission</option>
            {missions.map((mission) => (
              <option key={mission.id} value={mission.id}>
                {mission.title}
              </option>
            ))}
          </select>
        )}

        <select
          className="mission-input"
          value={draft.status}
          onChange={(e) => setDraft({ ...draft, status: e.target.value as ProjectStatus })}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <textarea
          className="mission-input"
          placeholder="Notes..."
          rows={3}
          value={draft.notes ?? ""}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
        />

        <div className="mission-actions">
          <button onClick={saveEditing}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="objective-card">
      <h3>
        {project.title}
        {isTracked && <span className="tracked-badge">★ Tracked</span>}
      </h3>

      {missionTitle && project.missionId && (
        <p className="category">
          <Link to={`/missions/${project.missionId}`}>{missionTitle}</Link>
        </p>
      )}

      <Link to={`/projects/${project.id}`} className="detail-link">
        View details →
      </Link>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${project.progress}%`,
          }}
        />
      </div>

      <div className="objective-footer">
        <span>{project.progress}%</span>
        <span>{project.status}</span>
      </div>

      {!readOnly && project.notes && <p className="hint">{project.notes}</p>}

      {!readOnly && (
        <div className="task-list">
          {project.tasks.map((task) => (
            <div key={task.id} className="task-item">
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                />
                <span className={task.done ? "task-done" : ""}>{task.title}</span>
              </label>
              <button
                type="button"
                className="task-remove"
                onClick={() => removeTask(task.id)}
                aria-label={`Remove task ${task.title}`}
              >
                ×
              </button>
            </div>
          ))}

          <div className="add-task">
            <input
              className="mission-input"
              placeholder="Add a task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <button onClick={addTask}>Add</button>
          </div>
        </div>
      )}

      {!readOnly && (
        <div className="mission-actions">
          <button onClick={increaseProgress}>Increase Progress</button>

          <button onClick={startEditing}>Edit</button>

          {project.status !== "Completed" && (
            <button onClick={completeProject}>Mark Complete</button>
          )}

          {onTrack && (
            <button onClick={onTrack} disabled={isTracked}>
              {isTracked ? "★ Tracked" : "Track on Dashboard"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectCard;
