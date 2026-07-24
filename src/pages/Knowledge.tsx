import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NoteCard from "../components/cards/NoteCard";
import useMissions from "../hooks/useMissions";
import useProjects from "../hooks/useProjects";
import useNotes from "../hooks/useNotes";
import { createId } from "../utils/id";

function Knowledge() {
  const { items: missions } = useMissions();
  const { items: projects } = useProjects();
  const {
    items: notes,
    addItem: addNote,
    updateItem: updateNote,
    removeItem: removeNote,
  } = useNotes();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [missionId, setMissionId] = useState("");
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    if (!location.hash) return;

    const target = document.getElementById(location.hash.slice(1));
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("highlight");
    const timeout = setTimeout(() => target.classList.remove("highlight"), 2000);
    return () => clearTimeout(timeout);
  }, [location.hash]);

  const missionTitleById = (id?: string) =>
    id ? missions.find((mission) => mission.id === id)?.title : undefined;

  const projectTitleById = (id?: string) =>
    id ? projects.find((project) => project.id === id)?.title : undefined;

  const handleAddNote = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const now = new Date().toISOString();
    addNote({
      id: createId(),
      title: trimmedTitle,
      body: body.trim(),
      missionId: missionId || undefined,
      projectId: projectId || undefined,
      createdAt: now,
      updatedAt: now,
    });
    setTitle("");
    setBody("");
    setMissionId("");
    setProjectId("");
  };

  const sortedNotes = [...notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <h1>Knowledge</h1>
      <p>Ideas, research, and lessons worth keeping.</p>

      <div className="add-note">
        <input
          className="mission-input"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="mission-input"
          placeholder="Write it down..."
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <div className="add-note-links">
          <select
            className="mission-input"
            value={missionId}
            onChange={(e) => setMissionId(e.target.value)}
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
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">No project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>

          <button onClick={handleAddNote}>Add Note</button>
        </div>
      </div>

      <div className="page-list">
        {sortedNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            missionTitle={missionTitleById(note.missionId)}
            projectTitle={projectTitleById(note.projectId)}
            missions={missions}
            projects={projects}
            onUpdate={updateNote}
            onRemove={removeNote}
          />
        ))}
      </div>

      {notes.length === 0 && <p className="hint">No notes yet. Add your first one above.</p>}
    </div>
  );
}

export default Knowledge;
