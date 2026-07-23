import type { Project } from "../../models/project";

type Props = {
  project: Project;
  missionTitle?: string;
  onTrack?: () => void;
  isTracked?: boolean;
};

function ProjectCard({ project, missionTitle, onTrack, isTracked = false }: Props) {
  return (
    <div className="objective-card">
      <h3>
        {project.title}
        {isTracked && <span className="tracked-badge">★ Tracked</span>}
      </h3>

      {missionTitle && <p className="category">{missionTitle}</p>}

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

      {onTrack && (
        <div className="mission-actions">
          <button onClick={onTrack} disabled={isTracked}>
            {isTracked ? "★ Tracked" : "Track on Dashboard"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProjectCard;
