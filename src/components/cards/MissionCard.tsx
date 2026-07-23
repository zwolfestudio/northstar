import { useState } from "react";
import type { Mission, MissionStatus, Priority } from "../../models/mission";

type Props = {
  mission: Mission;
  onUpdate?: (id: string, updates: Partial<Mission>) => void;
  readOnly?: boolean;
};

const STATUS_OPTIONS: MissionStatus[] = ["Planning", "Active", "On Hold", "Completed"];
const PRIORITY_OPTIONS: Priority[] = ["Low", "Medium", "High", "Critical"];

function MissionCard({ mission, onUpdate, readOnly = false }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(mission);

  const startEditing = () => {
    setDraft(mission);
    setIsEditing(true);
  };

  const saveEditing = () => {
    onUpdate?.(mission.id, {
      title: draft.title,
      category: draft.category,
      priority: draft.priority,
      status: draft.status,
    });
    setIsEditing(false);
  };

  const completeMission = () => {
    onUpdate?.(mission.id, {
      status: "Completed",
      progress: 100,
      completedAt: new Date().toISOString(),
    });
  };

  if (isEditing) {
    return (
      <div className="mission-card mission-card-editing">
        <input
          className="mission-input"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />

        <input
          className="mission-input"
          value={draft.category}
          onChange={(e) => setDraft({ ...draft, category: e.target.value })}
        />

        <select
          className="mission-input"
          value={draft.priority}
          onChange={(e) => setDraft({ ...draft, priority: e.target.value as Priority })}
        >
          {PRIORITY_OPTIONS.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>

        <select
          className="mission-input"
          value={draft.status}
          onChange={(e) => setDraft({ ...draft, status: e.target.value as MissionStatus })}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <div className="mission-actions">
          <button onClick={saveEditing}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mission-card">
      <div className="mission-header">
        <div>
          <h3>{mission.title}</h3>
          <p className="category">{mission.category}</p>
        </div>

        <span className="status">{mission.status}</span>
      </div>

      <div className="progress-section">
        <div className="progress-label">
          <span>Progress</span>
          <span>{mission.progress}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${mission.progress}%`,
            }}
          />
        </div>
      </div>

      {!readOnly && (
        <div className="mission-actions">
          <button
            onClick={() =>
              onUpdate?.(mission.id, {
                progress: Math.min(mission.progress + 5, 100),
              })
            }
          >
            Increase Progress
          </button>

          <button onClick={startEditing}>Edit</button>

          {mission.status !== "Completed" && (
            <button onClick={completeMission}>Mark Complete</button>
          )}
        </div>
      )}

      <span className="priority">{mission.priority} Priority</span>
    </div>
  );
}

export default MissionCard;
