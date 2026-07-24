import { useState } from "react";
import { Link } from "react-router-dom";
import type { Note } from "../../models/note";
import type { Mission } from "../../models/mission";
import type { Project } from "../../models/project";

type Props = {
  note: Note;
  missionTitle?: string;
  projectTitle?: string;
  missions: Mission[];
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onRemove: (id: string) => void;
};

function NoteCard({
  note,
  missionTitle,
  projectTitle,
  missions,
  projects,
  onUpdate,
  onRemove,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(note);

  const startEditing = () => {
    setDraft(note);
    setIsEditing(true);
  };

  const saveEditing = () => {
    onUpdate(note.id, {
      title: draft.title,
      body: draft.body,
      missionId: draft.missionId,
      projectId: draft.projectId,
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="objective-card mission-card-editing">
        <input
          className="mission-input"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />

        <textarea
          className="mission-input"
          rows={4}
          value={draft.body}
          onChange={(e) => setDraft({ ...draft, body: e.target.value })}
        />

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

        <select
          className="mission-input"
          value={draft.projectId ?? ""}
          onChange={(e) => setDraft({ ...draft, projectId: e.target.value || undefined })}
        >
          <option value="">No project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
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
    <div className="objective-card">
      <h3>{note.title}</h3>

      {(missionTitle || projectTitle) && (
        <p className="category">
          {note.missionId && missionTitle && (
            <Link to={`/missions/${note.missionId}`}>{missionTitle}</Link>
          )}
          {note.missionId && missionTitle && note.projectId && projectTitle && " · "}
          {note.projectId && projectTitle && (
            <Link to={`/projects/${note.projectId}`}>{projectTitle}</Link>
          )}
        </p>
      )}

      <p className="note-body">{note.body}</p>

      <div className="mission-actions">
        <button onClick={startEditing}>Edit</button>
        <button onClick={() => onRemove(note.id)}>Delete</button>
      </div>
    </div>
  );
}

export default NoteCard;
