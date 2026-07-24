import { Link, useParams } from "react-router-dom";
import ProjectCard from "../components/cards/ProjectCard";
import useMissions from "../hooks/useMissions";
import useProjects from "../hooks/useProjects";
import useNotes from "../hooks/useNotes";
import useTrackedItems from "../hooks/useTrackedItems";
import { getMissionForProject, getNotesForProject } from "../utils/relations";
import { formatDate } from "../utils/date";

function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { items: missions } = useMissions();
  const { items: projects, updateItem: updateProject } = useProjects();
  const { items: notes } = useNotes();
  const { tracked, trackProject } = useTrackedItems();

  const project = projects.find((item) => item.id === id);

  if (!project) {
    return (
      <div>
        <p className="hint">
          Project not found. <Link to="/projects">Back to Projects</Link>
        </p>
      </div>
    );
  }

  const parentMission = getMissionForProject(missions, project);
  const linkedNotes = getNotesForProject(notes, project.id);

  return (
    <div>
      <p className="breadcrumb">
        <Link to="/">Dashboard</Link> › <Link to="/projects">Projects</Link> ›{" "}
        <span className="breadcrumb-current">{project.title}</span>
      </p>

      <div className="page-list">
        <ProjectCard
          project={project}
          missionTitle={parentMission?.title}
          missions={missions}
          onUpdate={updateProject}
          onTrack={() => trackProject(project.id)}
          isTracked={tracked.projectId === project.id}
        />
      </div>

      <section className="card">
        <h2>Parent Mission</h2>

        {parentMission ? (
          <ul className="related-list">
            <li>
              <Link to={`/missions/${parentMission.id}`}>{parentMission.title}</Link>
              <span className="related-meta">
                {parentMission.progress}% · {parentMission.status}
              </span>
            </li>
          </ul>
        ) : (
          <p className="hint">This project isn't linked to a mission.</p>
        )}
      </section>

      <section className="card">
        <h2>Linked Notes</h2>

        {linkedNotes.length === 0 ? (
          <p className="hint">No notes linked to this project yet.</p>
        ) : (
          <ul className="related-list">
            {linkedNotes.map((note) => (
              <li key={note.id}>
                <Link to={`/knowledge#note-${note.id}`}>{note.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Timeline</h2>

        <ul className="related-list">
          <li>
            <span>Created</span>
            <span className="related-meta">{formatDate(project.createdAt)}</span>
          </li>
          <li>
            <span>Last Updated</span>
            <span className="related-meta">{formatDate(project.updatedAt)}</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default ProjectDetail;
