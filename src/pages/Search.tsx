import { useState } from "react";
import { Link } from "react-router-dom";
import useMissions from "../hooks/useMissions";
import useProjects from "../hooks/useProjects";
import useNotes from "../hooks/useNotes";
import { searchMissions, searchProjects, searchNotes } from "../utils/search";

function Search() {
  const { items: missions } = useMissions();
  const { items: projects } = useProjects();
  const { items: notes } = useNotes();
  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const missionResults = trimmed ? searchMissions(missions, trimmed) : [];
  const projectResults = trimmed ? searchProjects(projects, trimmed) : [];
  const noteResults = trimmed ? searchNotes(notes, trimmed) : [];
  const hasResults = missionResults.length > 0 || projectResults.length > 0 || noteResults.length > 0;

  return (
    <div>
      <h1>Search</h1>
      <p>Find anything across Missions, Projects, and Notes.</p>

      <input
        className="mission-input search-input"
        placeholder="Search Northstar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      {!trimmed && <p className="hint">Start typing to search.</p>}

      {trimmed && !hasResults && <p className="hint">No matches for "{trimmed}".</p>}

      {missionResults.length > 0 && (
        <section className="card">
          <h2>Missions</h2>
          <ul className="related-list">
            {missionResults.map((mission) => (
              <li key={mission.id}>
                <Link to={`/missions/${mission.id}`}>{mission.title}</Link>
                <span className="related-meta">{mission.status}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {projectResults.length > 0 && (
        <section className="card">
          <h2>Projects</h2>
          <ul className="related-list">
            {projectResults.map((project) => (
              <li key={project.id}>
                <Link to={`/projects/${project.id}`}>{project.title}</Link>
                <span className="related-meta">{project.status}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {noteResults.length > 0 && (
        <section className="card">
          <h2>Notes</h2>
          <ul className="related-list">
            {noteResults.map((note) => (
              <li key={note.id}>
                <Link to={`/knowledge#note-${note.id}`}>{note.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default Search;
