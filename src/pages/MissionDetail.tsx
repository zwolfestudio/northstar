import { Link, useParams } from "react-router-dom";
import MissionCard from "../components/cards/MissionCard";
import useMissions from "../hooks/useMissions";
import useProjects from "../hooks/useProjects";
import useNotes from "../hooks/useNotes";
import useTrackedItems from "../hooks/useTrackedItems";
import { getProjectsForMission, getNotesForMission } from "../utils/relations";

function MissionDetail() {
  const { id } = useParams<{ id: string }>();
  const { items: missions, updateItem: updateMission } = useMissions();
  const { items: projects } = useProjects();
  const { items: notes } = useNotes();
  const { tracked, trackMission } = useTrackedItems();

  const mission = missions.find((item) => item.id === id);

  if (!mission) {
    return (
      <div>
        <p className="hint">
          Mission not found. <Link to="/missions">Back to Missions</Link>
        </p>
      </div>
    );
  }

  const linkedProjects = getProjectsForMission(projects, mission.id);
  const linkedNotes = getNotesForMission(notes, mission.id);

  return (
    <div>
      <p className="breadcrumb">
        <Link to="/missions">← Missions</Link>
      </p>

      <div className="page-list">
        <MissionCard
          mission={mission}
          onUpdate={updateMission}
          onTrack={() => trackMission(mission.id)}
          isTracked={tracked.missionId === mission.id}
        />
      </div>

      <section className="card">
        <h2>Linked Projects</h2>

        {linkedProjects.length === 0 ? (
          <p className="hint">No projects linked to this mission yet.</p>
        ) : (
          <ul className="related-list">
            {linkedProjects.map((project) => (
              <li key={project.id}>
                <Link to={`/projects/${project.id}`}>{project.title}</Link>
                <span className="related-meta">
                  {project.progress}% · {project.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Linked Notes</h2>

        {linkedNotes.length === 0 ? (
          <p className="hint">No notes linked to this mission yet.</p>
        ) : (
          <ul className="related-list">
            {linkedNotes.map((note) => (
              <li key={note.id}>
                <Link to="/knowledge">{note.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default MissionDetail;
